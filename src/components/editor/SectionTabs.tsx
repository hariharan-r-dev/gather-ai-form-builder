import { useState } from "react";
import { Section } from "../../types";
import { KebabMenu } from "./RichText";

interface SectionTabsProps {
  sections: Section[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  onAddSection: () => void;
  onRenameSection: (id: string, name: string) => void;
  onDuplicateSection: (id: string) => void;
  onDeleteSection: (section: Section) => void;
  onMoveSection: (draggedId: string, targetId: string) => void;
}

export default function SectionTabs({
  sections,
  activeSectionId,
  onSelectSection,
  onAddSection,
  onRenameSection,
  onDuplicateSection,
  onDeleteSection,
  onMoveSection,
}: SectionTabsProps) {
  // Drag states
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

  // Kebab/rename/delete states
  const [sectionMenuId, setSectionMenuId] = useState<string | null>(null);
  const [renamingSectionId, setRenamingSectionId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  /* Section drag-and-drop */
  function handleSectionDragStart(e: React.DragEvent, sectionId: string) {
    setDraggedSectionId(sectionId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleSectionDragOver(e: React.DragEvent, sectionId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (sectionId !== draggedSectionId) setDragOverSectionId(sectionId);
  }

  function handleSectionDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (draggedSectionId && draggedSectionId !== targetId) {
      onMoveSection(draggedSectionId, targetId);
    }
    setDraggedSectionId(null);
    setDragOverSectionId(null);
  }

  return (
    <div className="flex-shrink-0 border-t border-[#E2E8F0] bg-white flex items-center h-11 px-3 gap-1 overflow-x-auto select-none">
      {/* Add section button */}
      <button
        onClick={onAddSection}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors flex-shrink-0 mr-1 cursor-pointer"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add section
      </button>

      <div className="w-px h-5 bg-[#E2E8F0] flex-shrink-0 mr-1" />

      {sections.map((section) => {
        const isActive = activeSectionId === section.id;
        const isDragOver = dragOverSectionId === section.id;
        const isRenaming = renamingSectionId === section.id;

        return (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleSectionDragStart(e, section.id)}
            onDragOver={(e) => handleSectionDragOver(e, section.id)}
            onDrop={(e) => handleSectionDrop(e, section.id)}
            onDragEnd={() => {
              setDraggedSectionId(null);
              setDragOverSectionId(null);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0 cursor-pointer group/sec ${
              isActive
                ? "bg-[#EFF6FF] text-[#2563EB]"
                : isDragOver
                ? "bg-[#F1F5F9] border border-dashed border-[#CBD5E1]"
                : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            } ${draggedSectionId === section.id ? "opacity-40" : ""}`}
            onClick={() => onSelectSection(section.id)}
          >
            {/* Drag handle icon */}
            <svg
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="currentColor"
              className="opacity-40 flex-shrink-0 cursor-grab"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <circle cx="3" cy="2" r="1.1" />
              <circle cx="7" cy="2" r="1.1" />
              <circle cx="3" cy="6" r="1.1" />
              <circle cx="7" cy="6" r="1.1" />
              <circle cx="3" cy="10" r="1.1" />
              <circle cx="7" cy="10" r="1.1" />
            </svg>

            {isRenaming ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onRenameSection(section.id, renameValue);
                  if (e.key === "Escape") setRenamingSectionId(null);
                }}
                onBlur={() => onRenameSection(section.id, renameValue)}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium bg-white border border-[#2563EB] rounded px-1.5 py-0.5 outline-none w-28 text-[#0f172a]"
              />
            ) : (
              <span className="text-xs font-medium whitespace-nowrap select-none">{section.title}</span>
            )}

            <KebabMenu
              isOpen={sectionMenuId === section.id}
              onOpen={() => setSectionMenuId(section.id)}
              onClose={() => setSectionMenuId(null)}
              items={[
                {
                  label: "Rename",
                  action: () => {
                    setRenamingSectionId(section.id);
                    setRenameValue(section.title);
                  },
                },
                { label: "Duplicate", action: () => onDuplicateSection(section.id) },
                { label: "Delete", action: () => onDeleteSection(section), danger: true },
              ]}
              upward
              iconSize={12}
              buttonClassName={`p-0.5 rounded hover:bg-black/10 transition-colors ${
                isActive ? "text-[#2563EB]" : "text-[#94A3B8]"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
