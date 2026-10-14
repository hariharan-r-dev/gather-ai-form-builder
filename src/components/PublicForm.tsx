import { useState, useRef } from "react";
import { Application, Question, Section, SubmissionAnswer } from "../types";
import { submissionService } from "../services/submissions/submissionService";
import { applicationService } from "../services/applications/applicationService";
import { isFormClosed, stripHtml } from "../utils/application";
import FileUploadField, { parseFileAnswer } from "./common/FileUploadField";
import { fileStorage } from "../services/storage/fileStorage";

interface PublicFormProps {
  app: Application;
}

function QuestionField({
  q,
  value,
  onChange,
  hasError,
  disabled,
  onUploadStateChange,
}: {
  q: Question;
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  disabled?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
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
      <FileUploadField
        value={value}
        onChange={onChange}
        hasError={hasError}
        disabled={disabled}
        onUploadStateChange={onUploadStateChange}
      />
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
      className={baseInputClass}
      placeholder={defaultPlaceholder}
    />
  );
}

export default function PublicForm({ app }: PublicFormProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isUpdatedResponse, setIsUpdatedResponse] = useState(false);
  const [isDynamicallyClosed, setIsDynamicallyClosed] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
  });

  const formTopRef = useRef<HTMLDivElement>(null);

  const sections = app.sections || [];
  const activeSection = sections[activeSectionIndex] || null;
  const isFirstSection = activeSectionIndex === 0;
  const isLastSection = activeSectionIndex === sections.length - 1;

  const isAnyFileUploading = Object.values(uploadingFields).some(Boolean);

  // Check form closed
  const closed = isDynamicallyClosed || isFormClosed(app);
  const allowEditing = Boolean(app.settings?.allowResponseEditing);

  if (closed && !submitted) {
    return (
      <div className="w-full min-h-full py-16 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#64748B]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#0F172A] mb-2">{stripHtml(app.name)}</h1>
        <p className="text-sm font-semibold text-[#0F172A] mb-1">This form is no longer accepting responses.</p>
        <p className="text-xs text-[#64748B] max-w-sm mb-6 leading-relaxed">
          The form has reached its configured closing date or submission limit. Please contact the form creator if you believe this is an error.
        </p>
      </div>
    );
  }

  function handleFieldValueChange(questionId: string, value: string) {
    setFormValues((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  }

  function validateSectionQuestions(section: Section): Record<string, string> {
    const sectionErrors: Record<string, string> = {};

    for (const q of section.questions) {
      const val = (formValues[q.id] || "").trim();
      const normType = (q.type || "").toLowerCase().replace(/[\s_-]+/g, "");

      if (q.required) {
        if (!val) {
          sectionErrors[q.id] = "This question is required";
          continue;
        }

        if (normType === "file" || normType === "fileupload" || normType === "upload") {
          const parsed = parseFileAnswer(val);
          if (!parsed || !parsed.fileName) {
            sectionErrors[q.id] = "This question is required";
            continue;
          }
        }

        if (normType === "multiplechoice" || normType === "checkboxes") {
          const selected = val.split(", ").filter(Boolean);
          if (selected.length === 0) {
            sectionErrors[q.id] = "This question is required";
            continue;
          }
        }
      }

      if (val) {
        if (normType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          sectionErrors[q.id] = "Please enter a valid email address";
        } else if (normType === "url" && !/^https?:\/\/.+/i.test(val)) {
          sectionErrors[q.id] = "Please enter a valid URL (starting with http:// or https://)";
        }
      }
    }

    return sectionErrors;
  }

  function scrollToFirstError(errorIds: string[]) {
    if (errorIds.length === 0) return;
    const firstId = errorIds[0];
    setTimeout(() => {
      const element = document.getElementById(`question-field-${firstId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = element.querySelector("input, textarea, select") as HTMLElement | null;
        input?.focus?.();
      }
    }, 50);
  }

  function handleNext() {
    if (!activeSection || isAnyFileUploading) return;
    const sectionErrors = validateSectionQuestions(activeSection);

    if (Object.keys(sectionErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...sectionErrors }));
      scrollToFirstError(Object.keys(sectionErrors));
      return;
    }

    setActiveSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handlePrev() {
    setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || isAnyFileUploading) return;

    // Validate entire form across all sections
    let firstInvalidSectionIndex = -1;
    let accumulatedErrors: Record<string, string> = {};

    for (let i = 0; i < sections.length; i++) {
      const sErrors = validateSectionQuestions(sections[i]);
      if (Object.keys(sErrors).length > 0) {
        if (firstInvalidSectionIndex === -1) {
          firstInvalidSectionIndex = i;
        }
        accumulatedErrors = { ...accumulatedErrors, ...sErrors };
      }
    }

    if (Object.keys(accumulatedErrors).length > 0) {
      setErrors(accumulatedErrors);
      if (firstInvalidSectionIndex !== -1 && firstInvalidSectionIndex !== activeSectionIndex) {
        setActiveSectionIndex(firstInvalidSectionIndex);
      }
      scrollToFirstError(Object.keys(accumulatedErrors));
      return;
    }

    // Build answer list across all sections
    const answers: SubmissionAnswer[] = [];
    for (const s of sections) {
      for (const q of s.questions) {
        const ans = formValues[q.id] || "";
        answers.push({
          questionId: q.id,
          question: q.label,
          questionType: q.type,
          answer: ans,
        });
      }
    }

    setIsSubmitting(true);
    try {
      if (submissionId && allowEditing) {
        // Update existing response
        await submissionService.updateSubmission(submissionId, answers);
        setIsUpdatedResponse(true);
      } else {
        // Create new response with server-authoritative RPC and idempotency key
        const newSub = await submissionService.createSubmission(
          app.id,
          answers,
          undefined,
          undefined,
          idempotencyKey
        );
        setSubmissionId(newSub.id);
        setIsUpdatedResponse(false);
      }
      setSubmitted(true);
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err: any) {
      console.error("Failed to submit form:", err);
      // Clean up any uploaded files if the submission was rejected by the server
      for (const ans of answers) {
        const parsed = parseFileAnswer(ans.answer);
        if (parsed?.fileId) {
          fileStorage.deleteFile(parsed.fileId, parsed.storagePath).catch(() => {});
        }
      }

      const msg = err?.message || "An error occurred while submitting your application.";
      if (
        msg.includes("no longer accepting responses") ||
        msg.includes("submission limit") ||
        msg.includes("closed") ||
        msg.includes("deadline") ||
        msg.includes("not accepting")
      ) {
        setIsDynamicallyClosed(true);
      } else {
        alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetForAnotherResponse() {
    try {
      const freshApp = await applicationService.getApplication(app.id);
      if (freshApp && isFormClosed(freshApp)) {
        setIsDynamicallyClosed(true);
        setSubmitted(false);
        return;
      }
    } catch (err) {
      console.error("Failed to check app status:", err);
    }

    // Generate fresh idempotency key for the new response
    try {
      setIdempotencyKey(crypto.randomUUID());
    } catch {
      setIdempotencyKey(`idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    }

    setSubmitted(false);
    setSubmissionId(null);
    setIsUpdatedResponse(false);
    setActiveSectionIndex(0);
    setFormValues({});
    setErrors({});
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
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
              <h1
                className="text-2xl font-semibold text-[#0F172A] leading-tight"
                dangerouslySetInnerHTML={{ __html: app.name || "Application" }}
              />
              {sections.length > 1 && !submitted && (
                <span className="text-xs font-medium px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] rounded-lg flex-shrink-0">
                  Section {activeSectionIndex + 1} of {sections.length}
                </span>
              )}
            </div>
            {app.description && (
              <div
                className="text-sm text-[#64748B] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: app.description }}
              />
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
              <h2 className="text-xl font-semibold text-[#0F172A] mb-2">
                {isUpdatedResponse ? "Response updated" : "Application submitted"}
              </h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
                {isUpdatedResponse
                  ? "Your response has been successfully updated."
                  : "Thank you for your response. Your application has been recorded."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {allowEditing && submissionId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setActiveSectionIndex(0);
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-xl transition-colors cursor-pointer"
                  >
                    Edit your response
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetForAnotherResponse}
                  className="px-5 py-2.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer"
                >
                  Submit another response
                </button>
              </div>
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
                        <div key={q.id} id={`question-field-${q.id}`} className="space-y-1.5 scroll-mt-6">
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
                            onUploadStateChange={(isUp) => setUploadingFields((prev) => ({ ...prev, [q.id]: isUp }))}
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
                    disabled={isSubmitting || isAnyFileUploading}
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
                    disabled={isSubmitting || isAnyFileUploading}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm ml-auto flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                        </svg>
                        <span>{submissionId ? "Updating..." : "Submitting..."}</span>
                      </>
                    ) : isAnyFileUploading ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                        </svg>
                        <span>Uploading file...</span>
                      </>
                    ) : (
                      <span>{submissionId ? "Update response" : "Submit application"}</span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting || isAnyFileUploading}
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm ml-auto flex items-center gap-1.5"
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
