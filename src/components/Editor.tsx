import { useState, useEffect } from "react";
import { Application, Question, Section, AskGatherMessage } from "../types";
import { processAskGatherMessage } from "../services/ai/askGather";
import { buildCreationSummary } from "../utils/creationSummary";
import { isValidFormCreationPrompt, isAmbiguousText } from "../services/ai/intentValidation";
import EditorLayout from "./editor/EditorLayout";
import EditorSidebar from "./editor/EditorSidebar";
import QuestionEditor from "./editor/QuestionEditor";
import QuestionSettings from "./editor/QuestionSettings";
import SectionTabs from "./editor/SectionTabs";

function defaultOptions(type: string): string[] | undefined {
  const choiceTypes = new Set(["single_choice", "multiple_choice", "dropdown", "checkbox"]);
  if (!choiceTypes.has(type)) return undefined;
  if (type === "checkbox") return ["I agree to the terms and conditions"];
  return ["Option 1", "Option 2", "Option 3"];
}

function getInitialMessages(app: Application): AskGatherMessage[] {
  if (app.askGatherHistory && app.askGatherHistory.length > 0) {
    return app.askGatherHistory;
  }
  if (app.creationPrompt && app.creationPrompt.trim().length > 0) {
    const prompt = app.creationPrompt.trim();
    let assistantMsg = "";
    if (isValidFormCreationPrompt(prompt)) {
      assistantMsg = buildCreationSummary(app.name, app.sections);
    } else if (isAmbiguousText(prompt)) {
      assistantMsg = "Sure — what would you like to improve? I can help with question wording, structure, sections, required fields, or answer types.";
    } else {
      assistantMsg = "It seems like your message isn't related to building or editing your form. I'm here to help you create and edit your form — for example, adding or removing questions, changing question types, editing sections, or improving your questions.\n\nWhat would you like to change?";
    }

    return [
      {
        id: `msg-init-user-${app.id}`,
        role: "user",
        content: prompt,
        createdAt: new Date().toISOString(),
      },
      {
        id: `msg-init-assistant-${app.id}`,
        role: "assistant",
        content: assistantMsg,
        createdAt: new Date().toISOString(),
        feedback: null,
        mutation: false,
      },
    ];
  }
  return [];
}

interface EditorProps {
  app: Application;
  onUpdateApp: (app: Application) => void;
}

export default function Editor({ app, onUpdateApp }: EditorProps) {
  const [activeSectionId, setActiveSectionId] = useState(app.sections[0]?.id || "");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<AskGatherMessage[]>(() => getInitialMessages(app));
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAutosave, setShowAutosave] = useState(true);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<Section | null>(null);

  useEffect(() => {
    if (!isAiLoading) {
      setAiMessages(getInitialMessages(app));
    }
  }, [app.id, app.askGatherHistory, app.creationPrompt, isAiLoading]);

  // Keep active section valid if sections change
  useEffect(() => {
    if (app.sections.length > 0 && !app.sections.some((s) => s.id === activeSectionId)) {
      setActiveSectionId(app.sections[0].id);
    }
  }, [app.sections, activeSectionId]);

  const activeSection = app.sections.find((s) => s.id === activeSectionId) || app.sections[0];

  function addSection() {
    const newSection: Section = { id: `s-${Date.now()}`, title: "New Section", questions: [] };
    onUpdateApp({ ...app, sections: [...app.sections, newSection] });
    setActiveSectionId(newSection.id);
  }

  function handleRenameSection(sectionId: string, newTitle: string) {
    onUpdateApp({
      ...app,
      sections: app.sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s)),
    });
  }

  function handleDuplicateSection(sectionId: string) {
    const section = app.sections.find((s) => s.id === sectionId);
    if (!section) return;
    const dup: Section = {
      ...section,
      id: `s-${Date.now()}`,
      title: section.title + " (copy)",
      questions: section.questions.map((q) => ({ ...q, id: `q-${Date.now()}-${q.id}` })),
    };
    const idx = app.sections.findIndex((s) => s.id === sectionId);
    const newSections = [...app.sections];
    newSections.splice(idx + 1, 0, dup);
    onUpdateApp({ ...app, sections: newSections });
  }

  function handleDeleteSection(sectionId: string) {
    const newSections = app.sections.filter((s) => s.id !== sectionId);
    onUpdateApp({ ...app, sections: newSections });
    if (activeSectionId === sectionId) {
      setActiveSectionId(newSections[0]?.id || "");
    }
    setDeleteSectionTarget(null);
  }

  function handleMoveSection(draggedId: string, targetId: string) {
    const sections = [...app.sections];
    const fromIdx = sections.findIndex((s) => s.id === draggedId);
    const toIdx = sections.findIndex((s) => s.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [removed] = sections.splice(fromIdx, 1);
    sections.splice(toIdx, 0, removed);
    onUpdateApp({ ...app, sections });
  }

  function addQuestion(sectionId: string, type: string) {
    const isRequiredByDefault = app.settings?.defaultQuestionRequired !== false;
    const label = type === "short_answer" ? "New question" : `${type.replace("_", " ")} question`;
    const newQ: Question = {
      id: `q-${Date.now()}`,
      label,
      type,
      required: isRequiredByDefault,
      options: defaultOptions(type),
    };
    const updated = app.sections.map((s) =>
      s.id === sectionId ? { ...s, questions: [...s.questions, newQ] } : s
    );
    onUpdateApp({ ...app, sections: updated });
    setSelectedQuestionId(newQ.id);
  }

  function updateQuestion(sectionId: string, qId: string, changes: Partial<Question>) {
    const updated = app.sections.map((s) =>
      s.id === sectionId
        ? { ...s, questions: s.questions.map((q) => (q.id === qId ? { ...q, ...changes } : q)) }
        : s
    );
    onUpdateApp({ ...app, sections: updated });
  }

  function deleteQuestion(sectionId: string, qId: string) {
    const updated = app.sections.map((s) =>
      s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== qId) } : s
    );
    onUpdateApp({ ...app, sections: updated });
    if (selectedQuestionId === qId) setSelectedQuestionId(null);
  }

  function duplicateQuestion(sectionId: string, qId: string) {
    const section = app.sections.find((s) => s.id === sectionId);
    const q = section?.questions.find((q) => q.id === qId);
    if (!q) return;
    const dup: Question = { ...q, id: `q-${Date.now()}`, label: q.label + " (copy)" };
    const updated = app.sections.map((s) => {
      if (s.id !== sectionId) return s;
      const idx = s.questions.findIndex((q) => q.id === qId);
      const newQs = [...s.questions];
      newQs.splice(idx + 1, 0, dup);
      return { ...s, questions: newQs };
    });
    onUpdateApp({ ...app, sections: updated });
  }

  function getCurrentHistory(): AskGatherMessage[] {
    if (app.askGatherHistory && app.askGatherHistory.length > 0) {
      return app.askGatherHistory;
    }
    if (aiMessages && aiMessages.length > 0) {
      return aiMessages;
    }
    return getInitialMessages(app);
  }

  function handleMessageFeedback(messageId: string, feedback: "helpful" | "not_helpful") {
    const currentHistory = getCurrentHistory();
    const updatedHistory = currentHistory.map((msg) => {
      if (msg.id === messageId) {
        return {
          ...msg,
          feedback: msg.feedback === feedback ? null : feedback,
        };
      }
      return msg;
    });

    setAiMessages(updatedHistory);
    onUpdateApp({
      ...app,
      creationPrompt: app.creationPrompt,
      askGatherHistory: updatedHistory,
    });
  }

  function handleMessageUndo(messageId: string) {
    const currentHistory = getCurrentHistory();
    const targetMsg = currentHistory.find((m) => m.id === messageId);
    if (!targetMsg || !targetMsg.previousFormState || targetMsg.undone) return;

    // Mark target message as undone
    const updatedHistory = currentHistory.map((msg) => {
      if (msg.id === messageId) {
        return {
          ...msg,
          undone: true,
        };
      }
      return msg;
    });

    setAiMessages(updatedHistory);

    // Revert form state safely to previousFormState
    const revertedApp: Application = {
      ...app,
      name: targetMsg.previousFormState.name,
      description: targetMsg.previousFormState.description,
      sections: targetMsg.previousFormState.sections,
      creationPrompt: app.creationPrompt,
      askGatherHistory: updatedHistory,
      lastUpdated: "just now",
    };

    onUpdateApp(revertedApp);
  }

  async function sendAiMessage(customInstruction?: string) {
    const text = (customInstruction || aiInput).trim();
    if (!text || isAiLoading) return;

    if (!customInstruction) {
      setAiInput("");
    }

    const userMsg: AskGatherMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const currentHistory = getCurrentHistory();
    const updatedHistoryWithUser = [...currentHistory, userMsg];

    setAiMessages(updatedHistoryWithUser);
    setIsAiLoading(true);

    try {
      const result = await processAskGatherMessage(app, text, currentHistory);

      const isMutation = Boolean((result.type === "edit" || result.type === "create") && result.updatedApp);
      const previousFormState = isMutation
        ? {
            name: app.name,
            description: app.description,
            sections: app.sections,
          }
        : undefined;

      const assistantMsg: AskGatherMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: result.message,
        createdAt: new Date().toISOString(),
        feedback: null,
        mutation: isMutation,
        previousFormState,
      };

      const finalHistory = [...updatedHistoryWithUser, assistantMsg];
      setAiMessages(finalHistory);

      if (isMutation && result.updatedApp) {
        // FORM_EDIT: Mutate application structure and persist
        const newApp: Application = {
          ...app,
          ...result.updatedApp,
          creationPrompt: app.creationPrompt,
          askGatherHistory: finalHistory,
        };
        onUpdateApp(newApp);
      } else {
        // CHAT or AMBIGUOUS or OUT_OF_SCOPE: Keep form 100% UNTOUCHED, only update conversation history
        const newApp: Application = {
          ...app,
          creationPrompt: app.creationPrompt,
          askGatherHistory: finalHistory,
        };
        onUpdateApp(newApp);
      }
    } catch (err: any) {
      console.error("Ask Gather AI message processing failed:", err);
      const errorMsg: AskGatherMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "Couldn't process your message. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setAiMessages([...updatedHistoryWithUser, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  }

  const selectedQuestion = activeSection?.questions.find((q) => q.id === selectedQuestionId);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full">
      {/* Autosave banner */}
      {showAutosave && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#EFF6FF] border-b border-[#BFDBFE] flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#2563EB]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l2 2" />
            </svg>
            Edits are always autosaved.
          </div>
          <button
            onClick={() => setShowAutosave(false)}
            className="text-[#93C5FD] hover:text-[#2563EB] transition-colors cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main resizable layout */}
      <EditorLayout
        sidebar={
          <EditorSidebar
            sidebarWidth={400} // Cloned by EditorLayout with user-dragged value
            aiInput={aiInput}
            onAiInputChange={setAiInput}
            aiMessages={aiMessages}
            onSendMessage={sendAiMessage}
            onFeedback={handleMessageFeedback}
            onUndo={handleMessageUndo}
            isLoading={isAiLoading}
          />
        }
        canvas={
          activeSection ? (
            <QuestionEditor
              app={app}
              activeSection={activeSection}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={setSelectedQuestionId}
              onUpdateApp={onUpdateApp}
              onDeleteQuestion={deleteQuestion}
              onDuplicateQuestion={duplicateQuestion}
              onAddQuestion={addQuestion}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-[#94A3B8]">
              Add a section to start editing.
            </div>
          )
        }
        settings={
          selectedQuestion && activeSection ? (
            <QuestionSettings
              key={selectedQuestion.id}
              question={selectedQuestion}
              onUpdate={(changes) => updateQuestion(activeSection.id, selectedQuestion.id, changes)}
              onClose={() => setSelectedQuestionId(null)}
            />
          ) : undefined
        }
      />

      {/* Section navigation tabs */}
      <SectionTabs
        sections={app.sections}
        activeSectionId={activeSection?.id || activeSectionId}
        onSelectSection={setActiveSectionId}
        onAddSection={addSection}
        onRenameSection={handleRenameSection}
        onDuplicateSection={handleDuplicateSection}
        onDeleteSection={setDeleteSectionTarget}
        onMoveSection={handleMoveSection}
      />

      {/* Delete section confirmation modal */}
      {deleteSectionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-semibold text-[#0F172A] mb-1">Delete section?</h3>
            <p className="text-sm text-[#64748B] mb-5">
              You're about to delete "{deleteSectionTarget.title}". This will remove the section and its questions.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteSectionTarget(null)}
                className="flex-1 py-2.5 text-sm text-[#0F172A] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSection(deleteSectionTarget.id)}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
