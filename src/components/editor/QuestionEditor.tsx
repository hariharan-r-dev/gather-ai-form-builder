import { useState } from "react";
import { Application, Question, Section } from "../../types";
import IntroBlock from "./IntroBlock";
import QuestionCard from "./QuestionCard";
import AddQuestion from "./AddQuestion";

interface QuestionEditorProps {
  app: Application;
  activeSection: Section;
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string | null) => void;
  onUpdateApp: (app: Application) => void;
  onDeleteQuestion: (sectionId: string, qId: string) => void;
  onDuplicateQuestion: (sectionId: string, qId: string) => void;
  onAddQuestion: (sectionId: string, type: string) => void;
}

export default function QuestionEditor({
  app,
  activeSection,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateApp,
  onDeleteQuestion,
  onDuplicateQuestion,
  onAddQuestion,
}: QuestionEditorProps) {
  // Question drag states
  const [draggedQId, setDraggedQId] = useState<string | null>(null);
  const [dragOverQId, setDragOverQId] = useState<string | null>(null);

  /* Question drag-and-drop */
  function handleQDragStart(e: React.DragEvent, qId: string) {
    setDraggedQId(qId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleQDragOver(e: React.DragEvent, qId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (qId !== draggedQId) setDragOverQId(qId);
  }

  function handleQDrop(e: React.DragEvent, targetQId: string) {
    e.preventDefault();
    if (!draggedQId || draggedQId === targetQId) {
      setDraggedQId(null);
      setDragOverQId(null);
      return;
    }

    const updatedSections = app.sections.map((s) => {
      if (s.id !== activeSection.id) return s;
      const questions = [...s.questions];
      const fromIdx = questions.findIndex((q) => q.id === draggedQId);
      const toIdx = questions.findIndex((q) => q.id === targetQId);
      if (fromIdx === -1 || toIdx === -1) return s;
      const [removed] = questions.splice(fromIdx, 1);
      questions.splice(toIdx, 0, removed);
      return { ...s, questions };
    });

    onUpdateApp({ ...app, sections: updatedSections });
    setDraggedQId(null);
    setDragOverQId(null);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Cover and details */}
      <IntroBlock app={app} onUpdateApp={onUpdateApp} />

      {/* Section body */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <input
            className="text-base font-semibold text-[#0F172A] bg-transparent border-none outline-none flex-1 placeholder:text-[#CBD5E1]"
            value={activeSection.title}
            onChange={(e) => {
              const updated = app.sections.map((s) =>
                s.id === activeSection.id ? { ...s, title: e.target.value } : s
              );
              onUpdateApp({ ...app, sections: updated });
            }}
            placeholder="Section name"
          />
        </div>

        {/* Question cards list */}
        <div className="space-y-2">
          {activeSection.questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isSelected={selectedQuestionId === q.id}
              onSelect={() => onSelectQuestion(q.id)}
              onDelete={() => onDeleteQuestion(activeSection.id, q.id)}
              onDuplicate={() => onDuplicateQuestion(activeSection.id, q.id)}
              draggable
              onDragStart={(e) => handleQDragStart(e, q.id)}
              onDragOver={(e) => handleQDragOver(e, q.id)}
              onDrop={(e) => handleQDrop(e, q.id)}
              isDragOver={dragOverQId === q.id}
            />
          ))}
        </div>

        {/* Add Question block */}
        <AddQuestion onAdd={(type) => onAddQuestion(activeSection.id, type)} />
      </div>
    </div>
  );
}
