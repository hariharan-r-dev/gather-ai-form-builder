import { useState, useRef } from "react";
import { Application, Question, SubmissionAnswer } from "../types";
import { submissionService } from "../services/submissions/submissionService";
import { applicationService } from "../services/applications/applicationService";

interface PublicFormProps {
  app: Application;
}

function QuestionField({
  q,
  value,
  onChange,
  hasError,
  disabled,
}: {
  q: Question;
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}) {
  const normType = (q.type || "").toLowerCase().replace(/[\s_-]+/g, "");

  const baseInputClass = `w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all ${
    hasError
      ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
      : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
  } bg-white text-[#0F172A] placeholder:text-[#94A3B8] disabled:bg-[#F8FAFC] disabled:cursor-not-allowed`;

  if (normType === "longanswer" || normType === "textarea" || normType === "paragraph") {
    return (
      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInputClass} resize-none min-h-[110px]`}
        rows={4}
        placeholder={q.placeholder || "Your answer..."}
      />
    );
  }

  if (normType === "singlechoice" || normType === "radio") {
    const opts = q.options && q.options.length > 0 ? q.options : ["Option 1", "Option 2", "Option 3"];
    return (
      <div className="space-y-2 pt-1">
        {opts.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#0F172A] hover:text-[#2563EB] transition-colors">
            <input
              type="radio"
              name={q.id}
              disabled={disabled}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="w-4 h-4 accent-[#2563EB] cursor-pointer"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (normType === "multiplechoice" || normType === "checkboxes") {
    const opts = q.options && q.options.length > 0 ? q.options : ["Option 1", "Option 2", "Option 3"];
    const currentSelected = value ? value.split(", ").filter(Boolean) : [];

    const toggleOpt = (opt: string) => {
      let updated: string[];
      if (currentSelected.includes(opt)) {
        updated = currentSelected.filter((o) => o !== opt);
      } else {
        updated = [...currentSelected, opt];
      }
      onChange(updated.join(", "));
    };

    return (
      <div className="space-y-2 pt-1">
        {opts.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#0F172A] hover:text-[#2563EB] transition-colors">
            <input
              type="checkbox"
              name={q.id}
              disabled={disabled}
              checked={currentSelected.includes(opt)}
              onChange={() => toggleOpt(opt)}
              className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (normType === "checkbox") {
    const labelText = q.options?.[0] || "I agree to the terms and conditions";
    const isChecked = value === "true" || value === "yes" || value === labelText;
    return (
      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#0F172A] pt-1">
        <input
          type="checkbox"
          disabled={disabled}
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked ? labelText : "")}
          className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
        />
        <span>{labelText}</span>
      </label>
    );
  }

  if (normType === "dropdown" || normType === "select") {
    const opts = q.options && q.options.length > 0 ? q.options : ["Option 1", "Option 2", "Option 3"];
    return (
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
      >
        <option value="">Select an option</option>
        {opts.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (normType === "file" || normType === "fileupload" || normType === "upload") {
    return (
      <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-[#2563EB]/40 transition-colors cursor-pointer bg-[#F8FAFC]/50 ${hasError ? "border-red-400" : "border-[#E2E8F0]"}`}>
        <svg className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <p className="text-xs text-[#64748B]">Click to upload or drag and drop</p>
        <p className="text-[10px] text-[#94A3B8] mt-1">PDF, DOC, DOCX up to 10MB</p>
      </div>
    );
  }

  let inputType = "text";
  let defaultPlaceholder = q.placeholder || "Your answer";

  if (normType === "email") {
    inputType = "email";
    defaultPlaceholder = q.placeholder || "you@example.com";
  } else if (normType === "phone") {
    inputType = "tel";
    defaultPlaceholder = q.placeholder || "+1 (555) 000-0000";
  } else if (normType === "number") {
    inputType = "number";
    defaultPlaceholder = q.placeholder || "0";
  } else if (normType === "url") {
    inputType = "url";
    defaultPlaceholder = q.placeholder || "https://";
  } else if (normType === "date") {
    inputType = "date";
    defaultPlaceholder = "";
  }

  return (
    <input
      type={inputType}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={defaultPlaceholder}
      className={baseInputClass}
    />
  );
}

export default function PublicForm({ app }: PublicFormProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  const sections = app.sections && app.sections.length > 0 ? app.sections : [];
  const activeSection = sections[activeSectionIndex] || sections[0];
  const isFirstSection = activeSectionIndex === 0;
  const isLastSection = activeSectionIndex === sections.length - 1;

  function handleFieldValueChange(qId: string, val: string) {
    setFormValues((prev) => ({ ...prev, [qId]: val }));
    if (errors[qId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[qId];
        return next;
      });
    }
  }

  function validateCurrentSection(): boolean {
    if (!activeSection) return true;
    const newErrors: Record<string, string> = {};
    for (const q of activeSection.questions) {
      if (q.required) {
        const val = formValues[q.id];
        if (!val || (typeof val === "string" && !val.trim())) {
          newErrors[q.id] = "This question is required";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  function handleNext() {
    if (!validateCurrentSection()) return;
    if (!isLastSection) {
      setActiveSectionIndex((prev) => prev + 1);
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handlePrev() {
    setErrors({});
    if (!isFirstSection) {
      setActiveSectionIndex((prev) => prev - 1);
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || submitted) return;

    if (!validateCurrentSection()) return;

    // Build answer list across all sections
    const answers: SubmissionAnswer[] = [];
    for (const s of sections) {
      for (const q of s.questions) {
        const ans = formValues[q.id] || "";
        answers.push({
          questionId: q.id,
          question: q.label,
          answer: ans,
        });
      }
    }

    setIsSubmitting(true);
    try {
      await submissionService.createSubmission(app.id, answers);
      await applicationService.incrementResponses(app.id);
      setSubmitted(true);
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert("An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-full py-10 px-4 flex flex-col items-center justify-start">
      <div ref={formTopRef} className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {app.coverImage && (
            <img src={app.coverImage} alt="Cover" className="w-full h-44 object-cover" />
          )}

          {/* Form Header */}
          <div className="px-8 pt-8 pb-5 border-b border-[#E2E8F0]">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h1 className="text-2xl font-semibold text-[#0F172A] leading-tight">{app.name}</h1>
              {sections.length > 1 && !submitted && (
                <span className="text-xs font-medium px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] rounded-lg flex-shrink-0">
                  Section {activeSectionIndex + 1} of {sections.length}
                </span>
              )}
            </div>
            {app.description && (
              <p className="text-sm text-[#64748B] leading-relaxed">{app.description}</p>
            )}
          </div>

          {submitted ? (
            /* Submission Confirmation Screen */
            <div className="p-12 text-center">
              <div className="w-14 h-14 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#0F172A] mb-2">Application submitted</h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
                Thank you for your response. Your application has been recorded.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setActiveSectionIndex(0);
                  setFormValues({});
                  setErrors({});
                }}
                className="px-5 py-2.5 text-xs font-medium text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-xl transition-colors cursor-pointer"
              >
                Submit another response
              </button>
            </div>
          ) : (
            /* Active Form Section */
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {activeSection ? (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2E8F0]">
                    <h2 className="text-base font-semibold text-[#0F172A]">
                      {activeSection.title}
                    </h2>
                    <span className="text-xs text-[#94A3B8]">
                      {activeSection.questions.length} question{activeSection.questions.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {activeSection.questions.map((q) => {
                      const hasError = Boolean(errors[q.id]);
                      return (
                        <div key={q.id} className="space-y-1.5">
                          <label className="block text-sm font-medium text-[#0F172A]">
                            {q.label}
                            {q.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                          </label>

                          <QuestionField
                            q={q}
                            value={formValues[q.id] || ""}
                            onChange={(val) => handleFieldValueChange(q.id, val)}
                            hasError={hasError}
                            disabled={isSubmitting}
                          />

                          {hasError && (
                            <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              <span>{errors[q.id]}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-[#94A3B8]">
                  No questions in this section.
                </div>
              )}

              {/* Action Buttons: Back / Next / Submit */}
              <div className="flex items-center justify-between gap-3 pt-6 border-t border-[#F1F5F9]">
                {!isFirstSection ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePrev}
                    className="px-5 py-2.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {isLastSection ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm ml-auto flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit application</span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm ml-auto flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Public Gather Branding */}
        <div className="flex items-center justify-center gap-1.5 mt-6 mb-10 text-xs text-[#94A3B8]">
          <span>Powered by</span>
          <span className="font-semibold text-[#2563EB]">Gather</span>
        </div>
      </div>
    </div>
  );
}
