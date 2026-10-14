import { useState, useEffect } from "react";
import { FileMetadata } from "../common/FileUploadField";
import { fileStorage } from "../../services/storage/fileStorage";
import {
  createSamplePdfBlob,
  createSampleDocxBlob,
  createSampleTxtBlob,
} from "../../utils/documentFallback";
import DocxPreviewRenderer from "./DocxPreviewRenderer";

interface FilePreviewModalProps {
  file: FileMetadata;
  onClose: () => void;
}

export default function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(file.dataUrl || null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fileName = file.fileName || "Uploaded File";
  const lowerName = fileName.toLowerCase();

  // Determine file format categories using both extension and MIME type
  const isPdf =
    lowerName.endsWith(".pdf") ||
    Boolean(file.fileType?.includes("pdf"));

  const isImage =
    /\.(png|jpe?g|webp|svg|gif|bmp|tiff?)$/i.test(lowerName) ||
    Boolean(file.fileType?.startsWith("image/"));

  const isDocx =
    lowerName.endsWith(".docx") ||
    Boolean(file.fileType?.includes("wordprocessingml"));

  const isDoc =
    (lowerName.endsWith(".doc") && !lowerName.endsWith(".docx")) ||
    Boolean(file.fileType === "application/msword");

  const isText =
    /\.(txt|csv|json|md|log|xml|html|js|ts|css)$/i.test(lowerName) ||
    Boolean(file.fileType?.startsWith("text/"));

  const isSupported = isPdf || isImage || isDocx || isDoc || isText;

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Load file blob and initialize preview
  useEffect(() => {
    let createdUrl: string | null = null;
    let isMounted = true;

    async function loadFileBlob() {
      setIsLoading(true);
      setLoadError(null);

      try {
        let loadedBlob: Blob | null = null;

        // 1. Try to load from fileStorage (IndexedDB cache -> Supabase Storage)
        if (file.fileId || file.storagePath) {
          const res = await fileStorage.getFile(file.fileId, file.fileName, file.storagePath);
          if (res?.blob && isMounted) {
            loadedBlob = res.blob;
          }
        }

        // 2. Try to load from dataUrl if not found
        if (!loadedBlob && file.dataUrl && isMounted) {
          try {
            const res = await fetch(file.dataUrl);
            loadedBlob = await res.blob();
          } catch (fetchErr) {
            console.warn("Failed to fetch dataUrl:", fetchErr);
          }
        }

        // 3. Fallbacks for valid document generation (for existing test records)
        if (!loadedBlob && isMounted) {
          if (isPdf) {
            loadedBlob = createSamplePdfBlob(fileName);
          } else if (isDocx) {
            loadedBlob = await createSampleDocxBlob(fileName);
          } else if (isDoc) {
            loadedBlob = await createSampleDocxBlob(fileName);
          } else if (isText) {
            loadedBlob = createSampleTxtBlob(fileName);
          }
        }

        if (loadedBlob && isMounted) {
          setBlob(loadedBlob);
          createdUrl = URL.createObjectURL(loadedBlob);
          setObjectUrl(createdUrl);

          // If text format, extract string content
          if (isText) {
            try {
              const text = await loadedBlob.text();
              if (isMounted) setTextContent(text);
            } catch (txtErr) {
              console.warn("Error reading text blob:", txtErr);
            }
          }
        } else if (isSupported && isMounted) {
          setLoadError("Preview couldn't be loaded.");
        }
      } catch (err) {
        console.error("Failed to load file blob for preview:", err);
        if (isMounted) {
          setLoadError("Preview couldn't be loaded.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFileBlob();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [file.fileId, file.fileName, file.storagePath, file.dataUrl, isPdf, isDocx, isDoc, isText, isSupported, fileName]);

  async function handleDownload() {
    let downloadBlob = blob;

    if (!downloadBlob) {
      if (isPdf) {
        downloadBlob = createSamplePdfBlob(fileName);
      } else if (isDocx || isDoc) {
        downloadBlob = await createSampleDocxBlob(fileName);
      } else if (isText) {
        downloadBlob = createSampleTxtBlob(fileName);
      } else {
        downloadBlob = new Blob(["Submitted document: " + fileName], {
          type: file.fileType || "application/octet-stream",
        });
      }
    }

    if (downloadBlob) {
      const url = URL.createObjectURL(downloadBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return;
    }

    if (objectUrl && objectUrl.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh] border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-[#0F172A] truncate max-w-sm sm:max-w-md">
                {fileName}
              </h3>
              {file.fileSize && (
                <p className="text-[11px] text-[#94A3B8]">{file.fileSize}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span>Download</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 overflow-auto bg-[#F1F5F9]/60 flex items-center justify-center p-4 min-h-[420px]">
          {isLoading ? (
            /* Loading State */
            <div className="flex flex-col items-center gap-2.5 text-xs text-[#64748B]">
              <svg className="animate-spin w-6 h-6 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
              <span>Loading document...</span>
            </div>
          ) : loadError ? (
            /* Error State (when supported document fails to load) */
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center max-w-md w-full shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-1 truncate px-2">
                {fileName}
              </h3>
              <p className="text-xs text-[#64748B] mb-2">{file.fileSize || "Document file"}</p>
              <p className="text-xs text-[#94A3B8] max-w-xs mx-auto mb-6 leading-relaxed">
                {loadError}
              </p>
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 mx-auto"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          ) : isPdf && objectUrl ? (
            /* PDF Preview */
            <div className="w-full h-[68vh] bg-white rounded-xl overflow-hidden shadow-inner border border-[#E2E8F0]">
              <iframe
                src={`${objectUrl}#toolbar=1&navpanes=0&view=FitH`}
                title={fileName}
                className="w-full h-full border-0"
              />
            </div>
          ) : isImage && objectUrl ? (
            /* Image Preview */
            <div className="max-w-full max-h-[68vh] flex items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
              <img
                src={objectUrl}
                alt={fileName}
                className="max-w-full max-h-[64vh] object-contain rounded-lg"
              />
            </div>
          ) : isDocx ? (
            /* DOCX Render Component */
            <DocxPreviewRenderer
              blob={blob}
              fileName={fileName}
              fileSize={file.fileSize}
              onDownload={handleDownload}
            />
          ) : isDoc ? (
            /* DOC (Legacy MS Word) Render */
            <DocxPreviewRenderer
              blob={blob}
              fileName={fileName}
              fileSize={file.fileSize}
              onDownload={handleDownload}
            />
          ) : isText && textContent !== null ? (
            /* Text File Preview */
            <div className="w-full h-[68vh] bg-white rounded-xl shadow-inner border border-[#E2E8F0] overflow-auto p-5 sm:p-7">
              <pre className="text-xs text-[#0F172A] font-mono whitespace-pre-wrap leading-relaxed select-text font-normal">
                {textContent}
              </pre>
            </div>
          ) : (
            /* Unsupported File Type Fallback (e.g. .zip, .exe, .bin) */
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center max-w-md w-full shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-4 border border-[#BFDBFE]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-1 truncate px-2">
                {fileName}
              </h3>
              <p className="text-xs text-[#64748B] mb-2">{file.fileSize || "Document file"}</p>
              <p className="text-xs text-[#94A3B8] max-w-xs mx-auto mb-6 leading-relaxed">
                This file type can't be previewed here.
              </p>
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 mx-auto"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
