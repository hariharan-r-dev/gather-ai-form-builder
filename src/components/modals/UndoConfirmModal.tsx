interface UndoConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function UndoConfirmModal({ onClose, onConfirm }: UndoConfirmModalProps) {
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

        <div className="w-10 h-10 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center justify-center mb-4 text-amber-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2 className="text-base font-semibold text-[#0F172A] mb-1.5">
          Undo this change?
        </h2>

        <p className="text-xs text-[#64748B] leading-relaxed mb-6">
          This will undo this change and restore the form to the state it was in before the agent's changes. Any changes you made manually (outside this chat) since then will also be undone. The chat history will be preserved.
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}
