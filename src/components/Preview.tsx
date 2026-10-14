import { useState, useEffect, useRef } from "react";
import { Application, Question, Section } from "../types";
import { stripHtml } from "../utils/application";
import FileUploadField, { parseFileAnswer } from "./common/FileUploadField";

interface PreviewProps {
  app: Application;
  onBack: () => void;
  onPublish?: () => void;
  plan?: "free" | "pro";
  onUpgrade?: () => void;
}

function QuestionField({
  q,
  value,
  onChange,
  hasError,
}: {
  q: Question;
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
}) {
  const normType = (q.type || "").toLowerCase().replace(/[\s_-]+/g, "");

  const baseInputClass = `w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all ${
    hasError
      ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500"
      : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
  } bg-white text-[#0F172A] placeholder:text-[#94A3B8]`;

  if (normType === "longanswer" || normType === "textarea" || normType === "paragraph") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInputClass} resize-none min-h-[100px]`}
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
      onChange={(e) => onChange(e.target.value)}
      placeholder={defaultPlaceholder}
      className={baseInputClass}
    />
  );
}

export default function Preview({ app, onBack, onUpgrade }: PreviewProps) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const [activeSectionId, setActiveSectionId] = useState(app.sections[0]?.id || "");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const sectionMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sections = app.sections && app.sections.length > 0 ? app.sections : [];
  const currentIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeSectionId)
  );
  const activeSection = sections[currentIndex] || sections[0];
  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === sections.length - 1;

  useEffect(() => {
    if (!showSectionMenu) return;
    function handleMouseDown(e: MouseEvent) {
      if (sectionMenuRef.current?.contains(e.target as Node)) return;
      setShowSectionMenu(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [showSectionMenu]);

  useEffect(() => {
    if (!showBrandingModal) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowBrandingModal(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showBrandingModal]);

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
      const element = document.getElementById(`preview-question-field-${firstId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = element.querySelector("input, textarea, select") as HTMLElement | null;
        input?.focus?.();
      }
    }, 50);
  }

  function handleNextSection() {
    if (!activeSection) return;
    const sectionErrors = validateSectionQuestions(activeSection);

    if (Object.keys(sectionErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...sectionErrors }));
      scrollToFirstError(Object.keys(sectionErrors));
      return;
    }

    setErrors({});
    if (!isLastSection) {
      const nextSection = sections[currentIndex + 1];
      if (nextSection) {
        setActiveSectionId(nextSection.id);
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }

  function handlePrevSection() {
    setErrors({});
    if (!isFirstSection) {
      const prevSection = sections[currentIndex - 1];
      if (prevSection) {
        setActiveSectionId(prevSection.id);
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }

  function handleSubmit() {
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
      if (firstInvalidSectionIndex !== -1 && firstInvalidSectionIndex !== currentIndex) {
        setActiveSectionId(sections[firstInvalidSectionIndex].id);
      }
      scrollToFirstError(Object.keys(accumulatedErrors));
      return;
    }

    setErrors({});
    setSubmitted(true);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectSection(sectionId: string) {
    setActiveSectionId(sectionId);
    setShowSectionMenu(false);
    setSubmitted(false);
    setErrors({});
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
      {/* ── Preview navigation bar (fixed / pinned at top) ───────────── */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-2.5 flex items-center relative flex-shrink-0 z-30">
        {/* Left: Home / back button */}
        <button
          onClick={onBack}
          title="Save as draft and go back"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors flex-shrink-0 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" stroke="none" />
          </svg>
        </button>

        {/* Center: Device switcher (Desktop / Mobile) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden text-xs">
            {(["desktop", "mobile"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  mode === m
                    ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                    : "text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
              >
                {m === "desktop" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                  </svg>
                )}
                {m === "desktop" ? "Desktop" : "Mobile"}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Section selector dropdown + Exit preview */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          {sections.length > 1 && (
            <div className="relative" ref={sectionMenuRef}>
              <button
                onClick={() => setShowSectionMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors max-w-[200px] cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                <span className="truncate">{activeSection?.title || "Section"}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="flex-shrink-0">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showSectionMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 min-w-[200px] z-50 animate-in fade-in zoom-in-95 duration-100">
                  {sections.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSection(s.id)}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        s.id === activeSection?.id
                          ? "text-[#2563EB] bg-[#EFF6FF] font-medium"
                          : "text-[#0F172A] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <span className="truncate">{s.title}</span>
                      <span className="text-[10px] text-[#94A3B8] ml-2 flex-shrink-0">
                        {idx + 1}/{sections.length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-[#0F172A] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Exit preview
          </button>
        </div>
      </div>

      {/* ── Scrollable form content area ─────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto py-8 px-4 flex flex-col items-center"
      >
        <div
          className={`bg-white rounded-2xl border border-[#E2E8F0] shadow-sm transition-all duration-300 ${
            mode === "mobile" ? "w-[390px] max-w-full my-2" : "w-full max-w-2xl my-2"
          }`}
        >
          {app.coverImage && (
            <img src={app.coverImage} alt="Cover" className="w-full h-40 object-cover rounded-t-2xl" />
          )}

          {/* Form Header */}
          <div className="px-8 pt-8 pb-5 border-b border-[#E2E8F0]">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h1
                className="text-2xl font-semibold text-[#0F172A] leading-tight"
                dangerouslySetInnerHTML={{ __html: app.name || "Application" }}
              />
              {sections.length > 1 && (
                <span className="text-xs font-medium px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] rounded-lg flex-shrink-0">
                  Section {currentIndex + 1} of {sections.length}
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
            /* Submission success view */
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-2">Submitted!</h2>
              <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-6">
                Thank you for your submission. We'll be in touch soon.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setActiveSectionId(sections[0]?.id || "");
                  setFormValues({});
                  setErrors({});
                }}
                className="px-4 py-2 text-xs font-medium text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-xl transition-colors cursor-pointer"
              >
                Submit another response
              </button>
            </div>
          ) : (
            /* Active Section & Question Cards */
            <div className="p-8 space-y-6">
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
                        <div key={q.id} id={`preview-question-field-${q.id}`} className="space-y-1.5 scroll-mt-6">
                          <label className="block text-sm font-medium text-[#0F172A]">
                            {q.label}
                            {q.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                          </label>

                          <QuestionField
                            q={q}
                            value={formValues[q.id] || ""}
                            onChange={(val) => handleFieldValueChange(q.id, val)}
                            hasError={hasError}
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
                  No section found in this application.
                </div>
              )}

              {/* Multi-section action buttons: Back / Next / Submit */}
              <div className="flex items-center justify-between gap-3 pt-6 border-t border-[#F1F5F9]">
                {!isFirstSection ? (
                  <button
                    type="button"
                    onClick={handlePrevSection}
                    className="px-5 py-2.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {isLastSection ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm ml-auto"
                  >
                    Submit application
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextSection}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm ml-auto flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Branding badge */}
        <div className="flex items-center gap-2 mt-4 mb-6">
          <span className="text-[11px] text-[#94A3B8]">
            Powered by <span className="text-[#2563EB] font-semibold">Gather</span>
          </span>
          <button
            type="button"
            onClick={() => setShowBrandingModal(true)}
            className="text-[10px] text-[#B0BAC9] hover:text-[#64748B] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Hide branding
          </button>
        </div>
      </div>

      {/* ── Branding / Upgrade Modal ───────────────────────────────── */}
      {showBrandingModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 px-4"
          onClick={() => setShowBrandingModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowBrandingModal(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center mb-4 text-[#2563EB]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-[#0F172A] mb-1.5">Remove Gather branding</h2>
            <p className="text-xs text-[#64748B] leading-relaxed mb-5">
              Make your forms fully yours by removing Gather branding from your published forms.
            </p>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#0F172A]">Pro plan</span>
                <span className="text-sm font-semibold text-[#0F172A]">
                  $19<span className="text-xs font-normal text-[#64748B]">/mo</span>
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Custom branding removal, unlimited submissions, and more.
              </p>
            </div>

            <button
              onClick={() => {
                setShowBrandingModal(false);
                onUpgrade?.();
              }}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Upgrade plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
