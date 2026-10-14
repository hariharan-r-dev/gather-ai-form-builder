import { useState } from "react";
import { AskGatherMessage } from "../../types";
import { useUIState } from "../../app/AppProvider";
import FeedbackModal from "../modals/FeedbackModal";
import UndoConfirmModal from "../modals/UndoConfirmModal";

interface EditorSidebarProps {
  sidebarWidth: number;
  aiInput: string;
  onAiInputChange: (val: string) => void;
  aiMessages: AskGatherMessage[];
  onSendMessage: (instruction?: string) => void;
  onFeedback?: (messageId: string, feedback: "helpful" | "not_helpful") => void;
  onUndo?: (messageId: string) => void;
  isLoading?: boolean;
}

export default function EditorSidebar({
  sidebarWidth,
  aiInput,
  onAiInputChange,
  aiMessages,
  onSendMessage,
  onFeedback,
  onUndo,
  isLoading = false,
}: EditorSidebarProps) {
  const { showToast } = useUIState();
  const [feedbackModalMessageId, setFeedbackModalMessageId] = useState<string | null>(null);
  const [undoConfirmMessageId, setUndoConfirmMessageId] = useState<string | null>(null);

  function handleSend(customText?: string) {
    if (isLoading) return;
    onSendMessage(customText);
  }

  function handleHelpfulClick(msgId: string) {
    onFeedback?.(msgId, "helpful");
    showToast("Thank you for feedback");
  }

  function handleNotHelpfulClick(msgId: string) {
    setFeedbackModalMessageId(msgId);
  }

  function handleFeedbackSubmit(_feedbackText: string) {
    if (feedbackModalMessageId) {
      onFeedback?.(feedbackModalMessageId, "not_helpful");
      setFeedbackModalMessageId(null);
      showToast("Thank you for feedback");
    }
  }

  function handleUndoClick(msgId: string) {
    setUndoConfirmMessageId(msgId);
  }

  function handleUndoConfirm() {
    if (undoConfirmMessageId) {
      onUndo?.(undoConfirmMessageId);
      setUndoConfirmMessageId(null);
    }
  }

  return (
    <div
      className="flex-shrink-0 bg-white flex flex-col h-full border-r border-[#E2E8F0] relative"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="text-sm font-semibold text-[#0F172A]">Ask Gather</span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-1.5 text-xs text-[#2563EB]">
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
            <span className="text-[11px] font-medium">Updating...</span>
          </div>
        )}
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {aiMessages.map((msg) => {
          const isUser = msg.role === "user";
          const canUndo = Boolean(msg.mutation && msg.previousFormState && !msg.undone);

          return (
            <div key={msg.id} className="space-y-1.5">
              <div
                className={`text-xs rounded-xl px-3 py-2.5 leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-[#2563EB] text-white ml-4"
                    : "bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]"
                }`}
              >
                {msg.content}
              </div>

              {!isUser && (
                <div className="space-y-1 pl-1">
                  <div className="flex items-center gap-1">
                    {/* Helpful (Thumbs Up) */}
                    <button
                      type="button"
                      title="Helpful"
                      aria-label="Helpful"
                      onClick={() => handleHelpfulClick(msg.id)}
                      className={`p-1.5 rounded-lg transition-colors text-xs flex items-center justify-center cursor-pointer ${
                        msg.feedback === "helpful"
                          ? "text-[#2563EB] bg-[#EFF6FF] ring-1 ring-[#BFDBFE]"
                          : "text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill={msg.feedback === "helpful" ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                    </button>

                    {/* Not helpful (Thumbs Down) */}
                    <button
                      type="button"
                      title="Not helpful"
                      aria-label="Not helpful"
                      onClick={() => handleNotHelpfulClick(msg.id)}
                      className={`p-1.5 rounded-lg transition-colors text-xs flex items-center justify-center cursor-pointer ${
                        msg.feedback === "not_helpful"
                          ? "text-[#DC2626] bg-[#FEF2F2] ring-1 ring-[#FECACA]"
                          : "text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill={msg.feedback === "not_helpful" ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                      </svg>
                    </button>

                    {/* Undo (Counter-clockwise arrow) */}
                    <button
                      type="button"
                      title={canUndo ? "Undo" : msg.undone ? "Change undone" : "Undo"}
                      aria-label="Undo"
                      disabled={!canUndo}
                      onClick={() => canUndo && handleUndoClick(msg.id)}
                      className={`p-1.5 rounded-lg transition-colors text-xs flex items-center justify-center ${
                        canUndo
                          ? "text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] cursor-pointer"
                          : "text-[#CBD5E1] opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 7v6h6" />
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                      </svg>
                    </button>
                  </div>

                  {/* Reverted status chip */}
                  {msg.undone && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-[11px] font-medium rounded-md border border-[#E2E8F0] mt-0.5 select-none">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7v6h6" />
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                      </svg>
                      <span>Reverted to an older state.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-xs rounded-xl px-3 py-2.5 leading-relaxed flex items-center gap-2">
            <svg className="animate-spin w-3 h-3 text-[#2563EB] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
            <span>Updating application...</span>
          </div>
        )}
      </div>

      {/* Input composer */}
      <div className="p-3 border-t border-[#E2E8F0]">
        <div className="flex items-end gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
          <textarea
            value={aiInput}
            disabled={isLoading}
            onChange={(e) => onAiInputChange(e.target.value)}
            placeholder={isLoading ? "Updating application..." : "Ask Gather to change your application..."}
            className="flex-1 text-xs bg-transparent outline-none resize-none placeholder:text-[#94A3B8] leading-relaxed min-h-[40px] max-h-24 text-[#0f172a] disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!aiInput.trim() || isLoading}
            className="p-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0 cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Not helpful feedback modal */}
      {feedbackModalMessageId && (
        <FeedbackModal
          onClose={() => setFeedbackModalMessageId(null)}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {/* Undo confirmation modal */}
      {undoConfirmMessageId && (
        <UndoConfirmModal
          onClose={() => setUndoConfirmMessageId(null)}
          onConfirm={handleUndoConfirm}
        />
      )}
    </div>
  );
}
