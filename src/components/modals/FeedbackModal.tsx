import { useState } from "react";

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (feedbackText: string) => void;
}

export default function FeedbackModal({ onClose, onSubmit }: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    onSubmit(feedbackText.trim());
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center mb-4 text-[#2563EB]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <h2 className="text-base font-semibold text-[#0F172A] mb-1">
          How could we improve this response?
        </h2>
        <p className="text-xs text-[#64748B] mb-4">
          Tell us what wasn't helpful so we can make Ask Gather better.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              autoFocus
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what wasn't helpful..."
              className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all resize-none placeholder:text-[#94A3B8]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!feedbackText.trim()}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Submit feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
