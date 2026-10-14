import { Application, Section, Question, FormSettings, AskGatherMessage } from "../../types";
import { DbApplication, DbSection, DbQuestion, DbQuestionOption } from "../../types/database";

export interface SupabaseApplicationTree extends DbApplication {
  sections?: Array<
    DbSection & {
      questions?: Array<
        DbQuestion & {
          question_options?: DbQuestionOption[];
        }
      >;
    }
  >;
}

export function isUuid(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function ensureUuid(id?: string): string {
  if (id && isUuid(id)) return id;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function mapDbQuestionToDomain(
  dbQ: DbQuestion,
  options: DbQuestionOption[] = []
): Question {
  const sortedOptions = [...options].sort((a, b) => a.position - b.position);
  return {
    id: dbQ.id,
    label: dbQ.label,
    type: dbQ.type,
    required: dbQ.required,
    placeholder: dbQ.placeholder || undefined,
    hasOther: dbQ.has_other || undefined,
    options: sortedOptions.length > 0 ? sortedOptions.map((o) => o.label) : undefined,
  };
}

export function mapDbSectionToDomain(
  dbSec: DbSection,
  questions: Question[] = []
): Section {
  return {
    id: dbSec.id,
    title: dbSec.title,
    questions,
  };
}

export function mapDbTreeToDomain(appTree: SupabaseApplicationTree): Application {
  const sections: Section[] = (appTree.sections || [])
    .sort((a, b) => a.position - b.position)
    .map((s) => {
      const questions: Question[] = (s.questions || [])
        .sort((a, b) => a.position - b.position)
        .map((q) => mapDbQuestionToDomain(q, q.question_options || []));

      return mapDbSectionToDomain(s, questions);
    });

  return {
    id: appTree.id,
    name: appTree.name,
    status: appTree.status,
    responses: appTree.responses_count || 0,
    lastUpdated: "just now",
    publishedAt: appTree.published_at || undefined,
    isPublic: appTree.is_public,
    publicId: appTree.public_id || appTree.id,
    slug: appTree.slug,
    sections,
    description: appTree.description || "",
    coverImage: appTree.cover_image || undefined,
    creationPrompt: appTree.creation_prompt || undefined,
    askGatherHistory: (appTree.ask_gather_history as unknown as AskGatherMessage[]) || [],
    settings: (appTree.settings as unknown as FormSettings) || undefined,
  };
}
