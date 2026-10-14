import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "../../lib/supabase";

const DB_NAME = "gather_files_db";
const DB_VERSION = 1;
const STORE_NAME = "uploaded_files";
const BUCKET_NAME = "submission-files";

export interface UploadAbortController {
  abort?: () => void;
}

interface StoredFileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

export const fileStorage = {
  /**
   * Saves an uploaded File/Blob to IndexedDB cache and syncs to Supabase Storage with real progress tracking.
   */
  async saveFile(
    file: File | Blob,
    customId?: string,
    fileName?: string,
    onProgress?: (percent: number) => void,
    abortRef?: UploadAbortController
  ): Promise<string> {
    const fileId = customId || `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const name = fileName || (file instanceof File ? file.name : "uploaded_document");
    const type = file.type || "application/octet-stream";
    const size = file.size;

    onProgress?.(5);

    // 1. Store in local IndexedDB for immediate cache
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const record: StoredFileRecord = {
          id: fileId,
          name,
          type,
          size,
          blob: file,
          createdAt: new Date().toISOString(),
        };

        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error("Failed to store file"));
      });
    } catch (err) {
      console.warn("IndexedDB storage fallback:", err);
    }

    onProgress?.(15);

    // 2. Upload to Supabase Storage with real progress tracking via XHR
    const storagePath = `uploads/${fileId}`;
    const supabaseUrl = SUPABASE_URL;
    const anonKey = SUPABASE_ANON_KEY;

    if (typeof XMLHttpRequest !== "undefined" && supabaseUrl && anonKey) {
      let isAborted = false;
      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          if (abortRef) {
            abortRef.abort = () => {
              isAborted = true;
              try {
                xhr.abort();
              } catch {}
              reject(new Error("Upload cancelled by user"));
            };
          }

          xhr.open("POST", `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${storagePath}`);
          xhr.setRequestHeader("apikey", anonKey);
          xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
          xhr.setRequestHeader("Content-Type", type);
          xhr.setRequestHeader("x-upsert", "true");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && event.total > 0) {
              const rawPct = Math.round((event.loaded / event.total) * 80); // 15% -> 95%
              onProgress?.(Math.min(15 + rawPct, 95));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              onProgress?.(100);
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onabort = () => {
            reject(new Error("Upload cancelled by user"));
          };

          xhr.onerror = () => {
            if (isAborted) {
              reject(new Error("Upload cancelled by user"));
            } else {
              reject(new Error("Network error during file upload"));
            }
          };

          xhr.send(file);
        });
      } catch (xhrErr: any) {
        if (isAborted || xhrErr?.message?.includes("cancelled")) {
          throw xhrErr;
        }
        console.warn("XHR upload failed, attempting fallback upload:", xhrErr);
        const { error: storageErr } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, file, {
            contentType: type,
            upsert: true,
          });

        if (storageErr) {
          throw new Error("Failed to upload file to storage. Please check your network connection.");
        }
        onProgress?.(100);
      }
    } else {
      const { error: storageErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          contentType: type,
          upsert: true,
        });

      if (storageErr) {
        throw new Error("Failed to upload file to storage. Please check your network connection.");
      }
      onProgress?.(100);
    }

    return fileId;
  },

  /**
   * Retrieves a stored file Blob by its fileId, storagePath, or Supabase Storage lookup.
   */
  async getFile(
    fileId?: string,
    fileName?: string,
    storagePath?: string
  ): Promise<{ blob: Blob; name: string; type: string; size: number } | null> {
    if (!fileId && !storagePath) return null;

    // 1. Check local IndexedDB cache first
    if (fileId) {
      try {
        const db = await openDB();
        const cached = await new Promise<StoredFileRecord | null>((resolve) => {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(fileId);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });

        if (cached?.blob) {
          return {
            blob: cached.blob,
            name: cached.name || fileName || "document",
            type: cached.type || "application/octet-stream",
            size: cached.size || cached.blob.size,
          };
        }
      } catch (err) {
        console.warn("IndexedDB read error:", err);
      }
    }

    // 2. Check Supabase Storage
    const pathsToTry: string[] = [];
    if (storagePath) pathsToTry.push(storagePath);
    if (fileId) {
      pathsToTry.push(`uploads/${fileId}`);
      pathsToTry.push(fileId);
    }

    for (const p of pathsToTry) {
      try {
        const { data: downloadedBlob, error: dlErr } = await supabase.storage
          .from(BUCKET_NAME)
          .download(p);

        if (downloadedBlob && !dlErr) {
          const type = downloadedBlob.type || "application/octet-stream";
          const size = downloadedBlob.size;
          const name = fileName || "document";

          // Cache in IndexedDB for subsequent instant access
          if (fileId) {
            try {
              const db = await openDB();
              const tx = db.transaction(STORE_NAME, "readwrite");
              tx.objectStore(STORE_NAME).put({
                id: fileId,
                name,
                type,
                size,
                blob: downloadedBlob,
                createdAt: new Date().toISOString(),
              });
            } catch {}
          }

          return {
            blob: downloadedBlob,
            name,
            type,
            size,
          };
        }
      } catch (storageErr) {
        console.warn(`Supabase storage download check failed for path ${p}:`, storageErr);
      }
    }

    // 3. Query files table for storage_path if not already tried
    if (fileId) {
      try {
        const { data: fileRow } = await (supabase.from("files") as any)
          .select("storage_path, original_filename, mime_type, size_bytes")
          .eq("file_id", fileId)
          .maybeSingle();

        if (fileRow?.storage_path && !pathsToTry.includes(fileRow.storage_path)) {
          const { data: dbBlob } = await supabase.storage
            .from(BUCKET_NAME)
            .download(fileRow.storage_path);

          if (dbBlob) {
            return {
              blob: dbBlob,
              name: fileRow.original_filename || fileName || "document",
              type: fileRow.mime_type || dbBlob.type || "application/octet-stream",
              size: fileRow.size_bytes || dbBlob.size,
            };
          }
        }
      } catch {}
    }

    return null;
  },

  /**
   * Generates a signed URL for a file in Supabase Storage.
   */
  async getSignedUrl(storagePath: string, expiresIn: number = 3600): Promise<string | null> {
    if (!storagePath) return null;
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(storagePath, expiresIn);

      if (error) {
        console.warn("[fileStorage] Error creating signed URL:", error);
        return null;
      }
      return data?.signedUrl || null;
    } catch (err) {
      console.warn("[fileStorage] Failed to get signed URL:", err);
      return null;
    }
  },

  /**
   * Deletes a file from IndexedDB and Supabase Storage.
   */
  async deleteFile(fileId: string, storagePath?: string): Promise<void> {
    if (!fileId && !storagePath) return;

    if (fileId) {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(fileId);
      } catch {}
    }

    const pathsToDelete = [storagePath, `uploads/${fileId}`].filter(Boolean) as string[];
    if (pathsToDelete.length > 0) {
      try {
        await supabase.storage.from(BUCKET_NAME).remove(pathsToDelete);
      } catch {}
    }
  },
};
