import { supabase } from "../lib/supabase";
import { ensureUuid } from "./applications/applicationMapper";
import { Section } from "../types";

export const sectionService = {
  /**
   * Fetches all sections for an application from Supabase.
   */
  async getSections(applicationId: string): Promise<Section[]> {
    const { data, error } = await supabase
      .from("sections")
      .select(`
        id,
        application_id,
        title,
        description,
        position,
        questions (
          id,
          label,
          type,
          required,
          placeholder,
          has_other,
          position,
          question_options (
            id,
            label,
            value,
            position
          )
        )
      `)
      .eq("application_id", applicationId)
      .order("position", { ascending: true });

    if (error) {
      console.error("[Gather Sections] Error fetching sections:", error);
      throw new Error("Couldn't load sections.");
    }

    return (data || []).map((sec: any) => ({
      id: sec.id,
      title: sec.title,
      questions: (sec.questions || [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((q: any) => ({
          id: q.id,
          label: q.label,
          type: q.type,
          required: q.required,
          placeholder: q.placeholder || undefined,
          hasOther: q.has_other || undefined,
          options: (q.question_options || [])
            .sort((a: any, b: any) => a.position - b.position)
            .map((opt: any) => opt.label),
        })),
    }));
  },

  /**
   * Inserts a new section into Supabase.
   */
  async createSection(applicationId: string, title: string, position: number, customId?: string): Promise<string> {
    const secId = ensureUuid(customId);
    const { error } = await supabase.from("sections").insert({
      id: secId,
      application_id: applicationId,
      title: title || "New Section",
      position,
    });

    if (error) {
      console.error("[Gather Sections] Error creating section:", error);
      throw new Error("Couldn't create section.");
    }
    return secId;
  },

  /**
   * Updates a section title or position in Supabase.
   */
  async updateSection(sectionId: string, updates: { title?: string; position?: number }): Promise<void> {
    const { error } = await supabase
      .from("sections")
      .update({
        ...(updates.title !== undefined ? { title: updates.title } : {}),
        ...(updates.position !== undefined ? { position: updates.position } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sectionId);

    if (error) {
      console.error("[Gather Sections] Error updating section:", error);
      throw new Error("Couldn't update section.");
    }
  },

  /**
   * Deletes a section (cascades to questions & options).
   */
  async deleteSection(sectionId: string): Promise<void> {
    const { error } = await supabase.from("sections").delete().eq("id", sectionId);
    if (error) {
      console.error("[Gather Sections] Error deleting section:", error);
      throw new Error("Couldn't delete section.");
    }
  },

  /**
   * Reorders sections by updating their position fields.
   */
  async reorderSections(sectionOrders: { id: string; position: number }[]): Promise<void> {
    for (const item of sectionOrders) {
      await supabase.from("sections").update({ position: item.position }).eq("id", item.id);
    }
  },
};
