import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Application } from "../../types";
import { useUIState } from "../../app/AppProvider";
import { getPublicFormUrl, getPublicFormDisplayUrl } from "../../utils/application";

interface PublishModalProps {
  app: Application;
  onClose: () => void;
  onPublished: () => Promise<void> | void;
  onUnpublished?: () => Promise<void> | void;
}

export default function PublishModal({ app, onClose, onPublished, onUnpublished }: PublishModalProps) {
  const { showToast } = useUIState();
  const isCurrentlyPublished = app.status === "published";
  const [published, setPublished] = useState(isCurrentlyPublished);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const fullUrl = getPublicFormUrl(app);
  const displayUrl = getPublicFormDisplayUrl(app);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(fullUrl, {
      width: 220,
      margin: 1.5,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => console.error("Error generating QR code:", err));

    return () => {
      isMounted = false;
    };
  }, [fullUrl]);

  async function handlePublish() {
    const totalQuestions = (app.sections || []).reduce((acc, s) => acc + (s.questions?.length || 0), 0);
    if (!app.sections || app.sections.length === 0 || totalQuestions === 0) {
      setError("Please add at least one section with a question before publishing.");
      return;
    }

    setError(null);
    setIsPublishing(true);
    try {
      await onPublished();
      setPublished(true);
      showToast("Application published successfully");
    } catch (err) {
      console.error("Failed to publish:", err);
      setError("Failed to publish application. Please check your connection and try again.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleUnpublish() {
    setIsPublishing(true);
    try {
      if (onUnpublished) {
        await onUnpublished();
      }
      setPublished(false);
      showToast("Application unpublished");
    } catch (err) {
      console.error("Failed to unpublish:", err);
      setError("Failed to unpublish application.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleCopy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const input = document.createElement("input");
        input.value = fullUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      showToast("Copied to clipboard");
    } catch {
      showToast("Copied to clipboard");
    }
  }

  async function handleDownloadQR() {
    try {
      const highResUrl = await QRCode.toDataURL(fullUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      });
      const link = document.createElement("a");
      link.href = highResUrl;
      link.download = `${app.slug || "application"}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR code:", err);
    }
  }

  function handleOpenForm() {
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {published ? (
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[#0F172A]">Your application is live</h2>
            </div>
            <p className="text-xs text-[#64748B] ml-9.5 mb-5 leading-relaxed">
              <span className="font-medium text-[#0F172A]">{app.name}</span> is now accepting responses.
            </p>

            {/* Public URL Box */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 mb-5 flex items-center justify-between gap-2">
              <span className="text-xs text-[#0F172A] font-medium truncate select-all">{displayUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex-shrink-0 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer px-1.5 py-0.5"
              >
                Copy link
              </button>
            </div>

            {/* QR Code Section */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 mb-5 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase mb-3">
                QR CODE
              </span>

              {qrDataUrl ? (
                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm mb-2.5">
                  <img
                    src={qrDataUrl}
                    alt={`QR code for ${app.name}`}
                    className="w-36 h-36 object-contain"
                  />
                </div>
              ) : (
                <div className="w-36 h-36 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-[#94A3B8] mb-2.5">
                  Generating QR...
                </div>
              )}

              <p className="text-xs text-[#64748B] mb-3">Scan to open the form</p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Action Buttons: Open form & Copy link */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                type="button"
                onClick={handleOpenForm}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                <span>Open form</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy link</span>
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                disabled={isPublishing}
                onClick={handleUnpublish}
                className="py-2 text-xs text-[#64748B] hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? "Updating..." : "Unpublish"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] mb-1">Publish application</h2>
            <p className="text-xs text-[#64748B] mb-5">Once published, anyone with the link can submit an application.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A]">{app.name}</span>
                <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 font-medium px-2 py-0.5 rounded-full">
                  Draft
                </span>
              </div>
              <div>
                <p className="text-[11px] text-[#64748B] mb-0.5">Public URL</p>
                <p className="text-xs text-[#0F172A] font-medium truncate">{displayUrl}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isPublishing}
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublish}
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                    </svg>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish now</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
