import { useState } from "react";
import { Question } from "../../types";
import { KebabMenu } from "./RichText";

export const FIELD_TYPE_LABELS: Record<string, string> = {
  short_answer: "Short answer",
  long_answer: "Long answer",
  email: "Email",
  phone: "Phone",
  number: "Number",
  url: "URL",
  single_choice: "Single choice",
  multiple_choice: "Multiple choice",
  dropdown: "Dropdown",
  date: "Date",
  file: "File upload",
  checkbox: "Checkbox",
};

interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragOver?: boolean;
}

export default function QuestionCard({
  question,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: QuestionCardProps) {
  const [showKebab, setShowKebab] = useState(false);

  const displayType = FIELD_TYPE_LABELS[question.type] || question.type;

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`bg-white border rounded-xl transition-all cursor-pointer ${
        isDragOver
          ? "border-[#2563EB] ring-1 ring-[#2563EB]/30"
          : isSelected
          ? "border-[#2563EB]/50 ring-1 ring-[#2563EB]/10 shadow-sm"
          : "border-[#E2E8F0] hover:border-[#CBD5E1]"
      }`}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-[#CBD5E1] hover:text-[#94A3B8] transition-colors px-0.5 py-1">
            <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
              <circle cx="4" cy="3" r="1.2" />
              <circle cx="8" cy="3" r="1.2" />
              <circle cx="4" cy="8" r="1.2" />
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="4" cy="13" r="1.2" />
              <circle cx="8" cy="13" r="1.2" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium text-[#0F172A] truncate"
              dangerouslySetInnerHTML={{ __html: question.label || "Untitled question" }}
            />
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-[#94A3B8]">{displayType}</span>
              {question.required && (
                <span className="text-[10px] text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded">Required</span>
              )}
            </div>
          </div>

          <KebabMenu
            isOpen={showKebab}
            onOpen={() => setShowKebab(true)}
            onClose={() => setShowKebab(false)}
            items={[
              { label: "Duplicate", action: onDuplicate },
              { label: "Delete", action: onDelete, danger: true },
            ]}
            buttonClassName="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8] hover:text-[#64748B] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
