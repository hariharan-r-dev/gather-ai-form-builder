import { useState, useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";
import { createSampleDocxBlob } from "../../utils/docxFallback";

interface DocxPreviewRendererProps {
  blob: Blob | null;
  fileName: string;
  fileSize?: string;
  onDownload: () => void;
}

export default function DocxPreviewRenderer({
  blob,
  fileName,
  fileSize,
  onDownload,
}: DocxPreviewRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function renderDocx() {
      if (!containerRef.current) return;
      setIsRendering(true);
      setRenderError(false);

      try {
        let activeBlob = blob;
        if (!activeBlob) {
          activeBlob = await createSampleDocxBlob(fileName);
        }

        const arrayBuffer = await activeBlob.arrayBuffer();

        if (containerRef.current && isMounted) {
          containerRef.current.innerHTML = "";
          await renderAsync(arrayBuffer, containerRef.current, undefined, {
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            breakPages: true,
            useBase64URL: true,
            renderChanges: false,
            renderComments: false,
          });

          if (isMounted) {
            setIsRendering(false);
          }
        }
      } catch (err) {
        console.error("DOCX rendering error:", err);
        if (isMounted) {
          setRenderError(true);
          setIsRendering(false);
        }
      }
    }

    renderDocx();

    return () => {
      isMounted = false;
    };
  }, [blob, fileName]);

  return (
    <div className="w-full h-[65vh] bg-[#F8FAFC] rounded-xl overflow-y-auto p-4 sm:p-6 shadow-inner border border-[#E2E8F0] relative flex flex-col items-center">
      {isRendering && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5 z-10">
          <svg className="animate-spin w-6 h-6 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
          </svg>
          <span className="text-xs font-medium text-[#64748B]">Loading document...</span>
        </div>
      )}

      {renderError ? (
        <div className="p-8 text-center max-w-md mx-auto my-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-3 border border-[#BFDBFE]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{fileName}</h3>
          <p className="text-xs text-[#64748B] mb-2">{fileSize || "Document"}</p>
          <p className="text-xs text-[#94A3B8] mb-6">Unable to preview this file.</p>
          <button
            type="button"
            onClick={onDownload}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 mx-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      ) : (
        <div ref={containerRef} className="w-full max-w-2xl mx-auto" />
      )}
    </div>
  );
}
