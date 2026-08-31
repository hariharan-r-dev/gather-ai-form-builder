import { useState } from "react";

const FIELD_TYPES = [
  { value: "short_answer", label: "Short answer" },
  { value: "long_answer", label: "Long answer" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "url", label: "URL" },
  { value: "single_choice", label: "Single choice" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "dropdown", label: "Dropdown" },
  { value: "date", label: "Date" },
  { value: "file", label: "File upload" },
  { value: "checkbox", label: "Checkbox" },
];

interface AddQuestionProps {
  onAdd: (type: string) => void;
}

export default function AddQuestion({ onAdd }: AddQuestionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-3 mt-3">
        <p className="text-xs font-medium text-[#64748B] mb-2">Choose answer type</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {FIELD_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                onAdd(type.value);
                setIsOpen(false);
              }}
              className="text-left px-2.5 py-2 text-xs text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] rounded-lg transition-colors border border-[#E2E8F0] hover:border-[#2563EB]/30 cursor-pointer"
            >
              {type.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-2 text-xs text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#2563EB] transition-colors py-2 mt-3 cursor-pointer"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
      Add question
    </button>
  );
}
