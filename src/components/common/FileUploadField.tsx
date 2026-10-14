import { useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";
import { fileStorage, UploadAbortController } from "../../services/storage/fileStorage";

export interface FileMetadata {
  fileId?: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  sizeBytes?: number;
  dataUrl?: string;
  lastModified?: number;
  storagePath?: string;
}

interface FileUploadFieldProps {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  disabled?: boolean;
  onError?: (err: string | null) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  accept?: string;
  maxSizeMB?: number;
}

type UploadStatus = "idle" | "uploading" | "ready" | "failed";

const DEFAULT_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const DEFAULT_MAX_SIZE_MB = 10;

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function parseFileAnswer(val: string): FileMetadata | null {
  if (!val || typeof val !== "string" || !val.trim()) return null;
  try {
    const parsed = JSON.parse(val);
    if (parsed && typeof parsed === "object" && typeof parsed.fileName === "string" && parsed.fileName.trim()) {
      return parsed as FileMetadata;
    }
  } catch {
    // Only match clean filename.ext patterns if accompanied by standard file extension
    const trimmed = val.trim();
    if (/^[\w,\s-]+\.(pdf|docx?|png|jpe?g|webp|csv|xlsx?|txt)$/i.test(trimmed)) {
      return { fileName: trimmed };
    }
  }
  return null;
}

export default function FileUploadField({
  value,
  onChange,
  hasError,
  disabled,
  onError,
  onUploadStateChange,
  accept = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
}: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(() => {
    return parseFileAnswer(value) ? "ready" : "idle";
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingFileMeta, setPendingFileMeta] = useState<{ name: string; size: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<UploadAbortController>({});
  const lastSelectedFileRef = useRef<File | null>(null);

  const fileInfo = parseFileAnswer(value);

  // Sync state if external value changes
  useEffect(() => {
    if (value && parseFileAnswer(value)) {
      setUploadStatus("ready");
    } else if (!value && uploadStatus === "ready") {
      setUploadStatus("idle");
    }
  }, [value]);

  // Clean up on unmount if upload was in progress
  useEffect(() => {
    return () => {
      if (abortControllerRef.current.abort) {
        try {
          abortControllerRef.current.abort();
        } catch {}
      }
    };
  }, []);

  function validateFile(file: File): string | null {
    // 1. File size check
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File is too large. Maximum file size is ${maxSizeMB}MB.`;
    }

    // 2. File extension check
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidExt = DEFAULT_ALLOWED_EXTENSIONS.includes(ext);

    // 3. MIME check
    const mime = file.type.toLowerCase();
    const isDocMime =
      mime.includes("pdf") ||
      mime.includes("msword") ||
      mime.includes("officedocument.wordprocessingml") ||
      mime === "application/octet-stream" ||
      mime === "";

    if (!isValidExt && !isDocMime) {
      return "File type not supported. Please upload a PDF, DOC, or DOCX file.";
    }

    return null;
  }

  async function handleFileSelection(file: File) {
    const error = validateFile(file);
    if (error) {
      setLocalError(error);
      onError?.(error);
      setUploadStatus("idle");
      setPendingFileMeta(null);
      return;
    }

    lastSelectedFileRef.current = file;
    setLocalError(null);
    onError?.(null);
    setUploadStatus("uploading");
    setUploadProgress(10);
    setPendingFileMeta({
      name: file.name,
      size: formatFileSize(file.size),
    });
    onUploadStateChange?.(true);

    try {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Real upload to Supabase Storage with progress reporting and abort support
      await fileStorage.saveFile(
        file,
        fileId,
        file.name,
        (percent) => {
          setUploadProgress(percent);
        },
        abortControllerRef.current
      );

      const metadata: FileMetadata = {
        fileId,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        lastModified: file.lastModified,
        storagePath: `uploads/${fileId}`,
      };

      setUploadStatus("ready");
      setUploadProgress(100);
      onUploadStateChange?.(false);
      onChange(JSON.stringify(metadata));
    } catch (err: any) {
      console.error("File upload error:", err);
      if (err?.message?.includes("cancelled")) {
        setUploadStatus("idle");
        setPendingFileMeta(null);
        setUploadProgress(0);
        onUploadStateChange?.(false);
        onChange("");
        return;
      }

      setUploadStatus("failed");
      const errorMsg = "Upload failed. Please check your connection and try again.";
      setLocalError(errorMsg);
      onError?.(errorMsg);
      onUploadStateChange?.(false);
      onChange(""); // Prevent form submission with failed upload
    }
  }

  function handleRetry() {
    if (lastSelectedFileRef.current) {
      handleFileSelection(lastSelectedFileRef.current);
    } else if (inputRef.current) {
      inputRef.current.click();
    }
  }

  function handleCancelUpload(e: React.MouseEvent) {
    e.stopPropagation();
    if (abortControllerRef.current.abort) {
      try {
        abortControllerRef.current.abort();
      } catch {}
    }
    setUploadStatus("idle");
    setPendingFileMeta(null);
    setUploadProgress(0);
    setLocalError(null);
    onError?.(null);
    onUploadStateChange?.(false);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && uploadStatus !== "uploading") setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || uploadStatus === "uploading") return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (fileInfo?.fileId) {
      fileStorage.deleteFile(fileInfo.fileId, fileInfo.storagePath);
    }
    setUploadStatus("idle");
    setPendingFileMeta(null);
    setUploadProgress(0);
    lastSelectedFileRef.current = null;
    onChange("");
    setLocalError(null);
    onError?.(null);
    onUploadStateChange?.(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const isUploading = uploadStatus === "uploading";
  const isFailed = uploadStatus === "failed";
  const isReady = uploadStatus === "ready" && (fileInfo || pendingFileMeta);

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        disabled={disabled || isUploading}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {isUploading ? (
        /* 2. Uploading State */
        <div className="p-3.5 bg-white border border-[#2563EB]/40 rounded-xl shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0F172A] truncate">
                  {pendingFileMeta?.name || "Uploading document..."}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {pendingFileMeta?.size && (
                    <span className="text-[11px] text-[#94A3B8]">{pendingFileMeta.size}</span>
                  )}
                  <span className="text-[10px] text-[#2563EB] font-medium bg-[#EFF6FF] px-1.5 py-0.2 rounded">
                    Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ""}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancelUpload}
              title="Cancel upload"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors ml-2 cursor-pointer flex-shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Visible Progress Bar */}
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-200"
              style={{ width: `${Math.max(uploadProgress, 8)}%` }}
            />
          </div>
        </div>
      ) : isFailed ? (
        /* 4. Upload Failed State */
        <div className="p-3.5 bg-white border border-red-400 ring-2 ring-red-400/10 rounded-xl shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0F172A] truncate">
                  {pendingFileMeta?.name || "Document upload"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1.5 py-0.2 rounded">
                    Upload failed
                  </span>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer ml-1"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              title="Remove file"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors ml-2 cursor-pointer flex-shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : isReady && (fileInfo || pendingFileMeta) ? (
        /* 3. Uploaded / Ready State */
        <div
          className={`flex items-center justify-between p-3.5 bg-white border rounded-xl transition-all shadow-sm ${
            hasError || localError
              ? "border-red-400 ring-2 ring-red-400/10"
              : "border-[#E2E8F0] hover:border-[#2563EB]/40"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#0F172A] truncate">
                {fileInfo?.fileName || pendingFileMeta?.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {(fileInfo?.fileSize || pendingFileMeta?.size) && (
                  <span className="text-[11px] text-[#94A3B8]">
                    {fileInfo?.fileSize || pendingFileMeta?.size}
                  </span>
                )}
                <span className="text-[10px] text-[#10B981] font-medium bg-[#ECFDF5] px-1.5 py-0.2 rounded">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              title="Remove file"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors ml-2 cursor-pointer flex-shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        /* 1. Idle State (Empty Upload Dropzone) */
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? "border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20"
              : hasError || localError
              ? "border-red-400 bg-red-50/20"
              : "border-[#E2E8F0] bg-[#F8FAFC]/50 hover:border-[#2563EB]/40 hover:bg-[#F8FAFC]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center mx-auto mb-2 text-[#94A3B8]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#0F172A]">
            <span className="text-[#2563EB] hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-[10px] text-[#94A3B8] mt-1">PDF, DOC, DOCX up to {maxSizeMB}MB</p>
        </div>
      )}

      {localError && (
        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{localError}</span>
        </p>
      )}
    </div>
  );
}
