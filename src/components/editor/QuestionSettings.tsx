import { useRef } from "react";
import { Question } from "../../types";
import { RichTextField, RichToolbar } from "./RichText";

const CHOICE_TYPES = new Set(["single_choice", "multiple_choice", "dropdown", "checkbox"]);

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

function defaultOptions(type: string): string[] | undefined {
  if (!CHOICE_TYPES.has(type)) return undefined;
  if (type === "checkbox") return ["I agree to the terms and conditions"];
  return ["Option 1", "Option 2", "Option 3"];
}

interface QuestionSettingsProps {
  question: Question;
  onUpdate: (changes: Partial<Question>) => void;
  onClose: () => void;
}

export default function QuestionSettings({ question, onUpdate, onClose }: QuestionSettingsProps) {
  const labelRef = useRef<HTMLDivElement>(null);
  const showOptions = CHOICE_TYPES.has(question.type);
  const showPlaceholder =
    !CHOICE_TYPES.has(question.type) &&
    question.type !== "file" &&
    question.type !== "date" &&
    question.type !== "checkbox";

  function updateOption(idx: number, val: string) {
    const opts = [...(question.options ?? [])];
    opts[idx] = val;
    onUpdate({ options: opts });
  }

  function addOption() {
    onUpdate({ options: [...(question.options ?? []), `Option ${(question.options?.length ?? 0) + 1}`] });
  }

  function removeOption(idx: number) {
    onUpdate({ options: question.options?.filter((_, i) => i !== idx) });
  }

  const supportsOther = question.type === "single_choice" || question.type === "multiple_choice" || question.type === "dropdown";

  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-[#E2E8F0] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between flex-shrink-0 bg-[#F8FAFC]">
        <span className="text-sm font-semibold text-[#0F172A]">Question Settings</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Question label */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-2">Question</p>
          <div className="mb-1.5">
            <RichToolbar containerRef={labelRef} />
          </div>
          <div className="border border-[#E2E8F0] rounded-lg px-3 py-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]/20 transition-all">
            <RichTextField
              html={question.label}
              onChange={(v) => onUpdate({ label: v })}
              placeholder="Enter question text"
              className="text-sm text-[#0F172A]"
              externalToolbar
              editableRef={labelRef}
            />
          </div>
        </div>

        {/* Answer type */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-2">Answer type</p>
          <select
            value={question.type}
            onChange={(e) => onUpdate({ type: e.target.value, options: defaultOptions(e.target.value) })}
            className="w-full text-sm px-2.5 py-2 border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Placeholder */}
        {showPlaceholder && (
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-2">Placeholder</p>
            <input
              value={question.placeholder ?? ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder={
                question.type === "email"
                  ? "you@example.com"
                  : question.type === "url"
                  ? "https://"
                  : question.type === "phone"
                  ? "+1 (555) 000-0000"
                  : question.type === "number"
                  ? "0"
                  : "Short answer"
              }
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all text-[#0f172a]"
            />
          </div>
        )}

        {/* Options */}
        {showOptions && (
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase mb-2">Options</p>
            <div className="space-y-1.5">
              {(question.options ?? []).map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    className="flex-1 text-sm px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] text-[#0f172a]"
                  />
                  {(question.options?.length ?? 0) > 1 && (
                    <button
                      onClick={() => removeOption(idx)}
                      className="text-[#94A3B8] hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#1D4ED8] mt-1 transition-colors"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add option
              </button>
            </div>
          </div>
        )}

        {/* Other option toggle */}
        {supportsOther && (
          <div className="flex items-center justify-between py-0.5 border-t border-[#F1F5F9] pt-3">
            <div>
              <p className="text-sm font-medium text-[#0F172A]">Allow "Other"</p>
              <p className="text-xs text-[#64748B] mt-0.5">Let users write in a custom option</p>
            </div>
            <button
              onClick={() => onUpdate({ hasOther: !question.hasOther })}
              style={{ width: 36, height: 20 }}
              className="relative flex-shrink-0"
            >
              <span
                style={{ width: 36, height: 20 }}
                className={`block rounded-full transition-colors ${question.hasOther ? "bg-[#2563EB]" : "bg-[#E2E8F0]"}`}
              />
              <span
                style={{ width: 16, height: 16, top: 2, left: question.hasOther ? 18 : 2 }}
                className="absolute bg-white rounded-full shadow transition-all"
              />
            </button>
          </div>
        )}

        {/* Email-specific Validation Info */}
        {question.type === "email" && (
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3 text-xs text-[#2563EB] leading-relaxed">
            <strong>Email validation active:</strong> This field automatically checks for a valid email structure (e.g. name@domain.com).
          </div>
        )}

        {/* Required */}
        <div className="flex items-center justify-between py-0.5 border-t border-[#F1F5F9] pt-3">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Required</p>
            <p className="text-xs text-[#64748B] mt-0.5">Respondents must answer</p>
          </div>
          <button
            onClick={() => onUpdate({ required: !question.required })}
            style={{ width: 36, height: 20 }}
            className="relative flex-shrink-0"
          >
            <span
              style={{ width: 36, height: 20 }}
              className={`block rounded-full transition-colors ${question.required ? "bg-[#2563EB]" : "bg-[#E2E8F0]"}`}
            />
            <span
              style={{ width: 16, height: 16, top: 2, left: question.required ? 18 : 2 }}
              className="absolute bg-white rounded-full shadow transition-all"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
