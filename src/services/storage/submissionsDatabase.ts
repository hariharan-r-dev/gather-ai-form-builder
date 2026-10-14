import { Submission } from "../../types";

const DB_NAME = "gather_submissions_db";
const DB_VERSION = 1;
const STORE_NAME = "submissions";
const LEGACY_STORAGE_KEY = "gather_submissions";

// In-memory fallback for environments without IndexedDB (e.g. unit tests / SSR)
let memoryStore: Map<string, Submission> = new Map();
let isMigrationDone = false;

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
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("applicationId", "applicationId", { unique: false });
        store.createIndex("submittedAt", "submittedAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open Submissions IndexedDB"));
  });
}

function cleanLegacySubmissionAnswers(sub: Submission): Submission {
  // Strip large dataUrl / base64 from stored answers
  const cleanedAnswers = (sub.answers || []).map((ans) => {
    if (ans.answer && typeof ans.answer === "string" && ans.answer.startsWith("{") && ans.answer.includes("dataUrl")) {
      try {
        const parsed = JSON.parse(ans.answer);
        if (parsed.dataUrl) {
          delete parsed.dataUrl;
          return { ...ans, answer: JSON.stringify(parsed) };
        }
      } catch {}
    }
    return ans;
  });

  return { ...sub, answers: cleanedAnswers };
}

export const submissionsDatabase = {
  /**
   * Performs a safe, one-time migration from legacy localStorage to IndexedDB.
   */
  async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === "undefined" || !window.localStorage) return;

    try {
      const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!legacyData) return;

      const rawSubmissions: Submission[] = JSON.parse(legacyData);
      if (Array.isArray(rawSubmissions) && rawSubmissions.length > 0) {
        const cleaned = rawSubmissions.map(cleanLegacySubmissionAnswers);

        try {
          const db = await openDB();
          await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);

            for (const sub of cleaned) {
              store.put(sub);
            }

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
          });
        } catch {
          // Fallback to memory store if IndexedDB unavailable
          for (const sub of cleaned) {
            memoryStore.set(sub.id, sub);
          }
        }
      }

      // Safe cleanup of legacy localStorage key after migration
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to migrate legacy submissions from localStorage:", err);
    }
  },

  async getAllSubmissions(): Promise<Submission[]> {
    await this.migrateFromLocalStorage();

    try {
      const db = await openDB();
      return new Promise<Submission[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error || new Error("Failed to read submissions"));
      });
    } catch {
      return Array.from(memoryStore.values());
    }
  },

  async getSubmissionsByApplication(applicationId: string): Promise<Submission[]> {
    await this.migrateFromLocalStorage();

    try {
      const db = await openDB();
      return new Promise<Submission[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const index = store.index("applicationId");
        const req = index.getAll(applicationId);

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error || new Error("Failed to query submissions"));
      });
    } catch {
      return Array.from(memoryStore.values()).filter((s) => s.applicationId === applicationId);
    }
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    await this.migrateFromLocalStorage();

    try {
      const db = await openDB();
      return new Promise<Submission | null>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error || new Error("Failed to get submission"));
      });
    } catch {
      return memoryStore.get(id) || null;
    }
  },

  async saveSubmission(submission: Submission): Promise<Submission> {
    await this.migrateFromLocalStorage();
    const cleaned = cleanLegacySubmissionAnswers(submission);

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(cleaned);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error("Failed to save submission"));
      });
    } catch {
      memoryStore.set(cleaned.id, cleaned);
    }

    return cleaned;
  },

  async deleteSubmission(id: string): Promise<void> {
    await this.migrateFromLocalStorage();

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error("Failed to delete submission"));
      });
    } catch {
      memoryStore.delete(id);
    }
  },

  async getSubmissionCount(applicationId: string): Promise<number> {
    await this.migrateFromLocalStorage();

    try {
      const db = await openDB();
      return new Promise<number>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const index = store.index("applicationId");
        const req = index.count(applicationId);

        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => reject(req.error || new Error("Failed to count submissions"));
      });
    } catch {
      return Array.from(memoryStore.values()).filter((s) => s.applicationId === applicationId).length;
    }
  },
};
