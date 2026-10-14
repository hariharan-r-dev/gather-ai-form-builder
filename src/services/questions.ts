import { supabase } from "../lib/supabase";
import { ensureUuid } from "./applications/applicationMapper";
import { Question } from "../types";

export const questionService = {
  /**
   * Inserts a new question into Supabase with optional choice options.
   */
  async createQuestion(
    applicationId: string,
    sectionId: string,
    question: Question,
    position: number
  ): Promise<string> {
    const qId = ensureUuid(question.id);

    const { error: qError } = await supabase.from("questions").insert({
      id: qId,
      section_id: sectionId,
      application_id: applicationId,
      label: question.label || "New Question",
      type: question.type,
      required: Boolean(question.required),
      placeholder: question.placeholder || null,
      has_other: Boolean(question.hasOther),
      position,
    });

    if (qError) {
      console.error("[Gather Questions] Error creating question:", qError);
      throw new Error("Couldn't create question.");
    }

    if (question.options && Array.isArray(question.options) && question.options.length > 0) {
      const optionInserts = question.options.map((opt, optIdx) => ({
        id: ensureUuid(),
        question_id: qId,
        label: opt,
        value: opt,
        position: optIdx,
      }));

      const { error: optError } = await supabase.from("question_options").insert(optionInserts);
      if (optError) {
        console.error("[Gather Questions] Error creating question options:", optError);
      }
    }

    return qId;
  },

  /**
   * Updates question details, required state, and options.
   */
  async updateQuestion(
    questionId: string,
    updates: Partial<Question>,
    options?: string[]
  ): Promise<void> {
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.label !== undefined) updatePayload.label = updates.label;
    if (updates.type !== undefined) updatePayload.type = updates.type;
    if (updates.required !== undefined) updatePayload.required = updates.required;
    if (updates.placeholder !== undefined) updatePayload.placeholder = updates.placeholder;
    if (updates.hasOther !== undefined) updatePayload.has_other = updates.hasOther;

    const { error: qError } = await supabase.from("questions").update(updatePayload).eq("id", questionId);
    if (qError) {
      console.error("[Gather Questions] Error updating question:", qError);
      throw new Error("Couldn't update question.");
    }

    if (options !== undefined) {
      // Re-synchronize options
      await supabase.from("question_options").delete().eq("question_id", questionId);

      if (options.length > 0) {
        const optionInserts = options.map((opt, optIdx) => ({
          id: ensureUuid(),
          question_id: questionId,
          label: opt,
          value: opt,
          position: optIdx,
        }));
        await supabase.from("question_options").insert(optionInserts);
      }
    }
  },

  /**
   * Deletes a question and its options.
   */
  async deleteQuestion(questionId: string): Promise<void> {
    const { error } = await supabase.from("questions").delete().eq("id", questionId);
    if (error) {
      console.error("[Gather Questions] Error deleting question:", error);
      throw new Error("Couldn't delete question.");
    }
  },

  /**
   * Reorders questions within a section.
   */
  async reorderQuestions(questionOrders: { id: string; position: number }[]): Promise<void> {
    for (const item of questionOrders) {
      await supabase.from("questions").update({ position: item.position }).eq("id", item.id);
    }
  },
};
