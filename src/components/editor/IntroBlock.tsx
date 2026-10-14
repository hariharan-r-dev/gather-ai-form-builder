import { useState, useRef } from "react";
import { Application } from "../../types";
import { RichTextField, RichToolbar } from "./RichText";
import { stripHtml, createApplicationSlug } from "../../utils/application";

interface IntroBlockProps {
  app: Application;
  onUpdateApp: (app: Application) => void;
}

export default function IntroBlock({ app, onUpdateApp }: IntroBlockProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [focusedField, setFocusedField] = useState<"title" | "desc" | null>(null);

  function handleNameChange(v: string) {
    const clean = stripHtml(v);
    const shouldUpdateSlug =
      !app.slug ||
      app.slug === "untitled-form" ||
      app.slug === createApplicationSlug(app.name);

    onUpdateApp({
      ...app,
      name: v,
      slug: shouldUpdateSlug ? createApplicationSlug(clean) : app.slug,
    });
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl mb-4 overflow-hidden shadow-sm">
      {app.coverImage ? (
        <div className="relative h-36 bg-[#F1F5F9]">
          <img src={app.coverImage} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => onUpdateApp({ ...app, coverImage: undefined })}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-[#64748B] hover:text-[#0F172A] shadow-sm cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-5 pt-4 pb-2 text-xs text-[#94A3B8] hover:text-[#64748B] cursor-pointer transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          Add cover image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => onUpdateApp({ ...app, coverImage: ev.target?.result as string });
              reader.readAsDataURL(file);
            }}
          />
        </label>
      )}

      <div className="px-5 pb-5 pt-3">
        {focusedField !== null && (
          <div className="mb-2">
            <RichToolbar containerRef={focusedField === "title" ? titleRef : descRef} />
          </div>
        )}
        <RichTextField
          html={app.name}
          onChange={handleNameChange}
          placeholder="Application title"
          className="text-xl font-semibold text-[#0F172A] leading-snug"
          externalToolbar
          editableRef={titleRef}
          onFocus={() => setFocusedField("title")}
          onBlur={() => setFocusedField(null)}
        />
        <RichTextField
          html={app.description}
          onChange={(v) => onUpdateApp({ ...app, description: v })}
          placeholder="Add a description..."
          className="text-sm text-[#64748B] leading-relaxed mt-1"
          maxHeightClass="max-h-32"
          externalToolbar
          editableRef={descRef}
          onFocus={() => setFocusedField("desc")}
          onBlur={() => setFocusedField(null)}
        />
      </div>
    </div>
  );
}
