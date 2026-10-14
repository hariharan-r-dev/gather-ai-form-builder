import { Application, Section, AskGatherMessage, FormSettings } from "../types";
import { createApplication as createBaseApp, createApplicationSlug, stripHtml } from "../utils/application";
import { buildCreationSummary } from "../utils/creationSummary";
import { isValidFormCreationPrompt, isAmbiguousText } from "./ai/intentValidation";
import { supabase } from "../lib/supabase";
import {
  ensureUuid,
  isUuid,
  mapDbTreeToDomain,
  SupabaseApplicationTree,
} from "./applications/applicationMapper";

export interface ResolvedOwnership {
  userId: string | null;
  organizationId: string;
}

/**
 * Resolves the authenticated Supabase user and their organization ID from organization_members.
 */
export async function resolveOrganizationAndUser(): Promise<ResolvedOwnership> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;

    if (userId) {
      const { data: memberData } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (memberData?.organization_id) {
        return { userId, organizationId: memberData.organization_id };
      }
    }

    // Fallback: check if an organization exists in the database
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id, owner_id")
      .limit(1)
      .maybeSingle();

    if (orgData?.id) {
      return { userId: orgData.owner_id || userId, organizationId: orgData.id };
    }
  } catch (err) {
    console.warn("[Gather Auth] Warning resolving organization ownership:", err);
  }

  // Safe fallback workspace UUID if no org is yet loaded
  return {
    userId: null,
    organizationId: "00000000-0000-0000-0000-000000000001",
  };
}

async function generateUniqueSlug(baseSlug: string, excludeAppId?: string): Promise<string> {
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from("applications").select("id").eq("slug", candidate);
    if (excludeAppId && isUuid(excludeAppId)) {
      query = query.neq("id", excludeAppId);
    }
    const { data } = await query.limit(1);
    if (!data || data.length === 0) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const applicationService = {
  /**
   * Fetches all applications for the organization from Supabase PostgreSQL.
   */
  async getApplications(): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          organization_id,
          created_by,
          name,
          slug,
          description,
          status,
          is_public,
          public_id,
          published_at,
          cover_image,
          creation_prompt,
          ask_gather_history,
          settings,
          responses_count,
          created_at,
          updated_at,
          sections (
            id,
            application_id,
            title,
            description,
            position,
            created_at,
            updated_at,
            questions (
              id,
              section_id,
              application_id,
              label,
              type,
              required,
              placeholder,
              has_other,
              position,
              settings,
              created_at,
              updated_at,
              question_options (
                id,
                question_id,
                label,
                value,
                position,
                created_at
              )
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data && Array.isArray(data)) {
        return (data as unknown as SupabaseApplicationTree[]).map(mapDbTreeToDomain);
      }
    } catch (err) {
      console.error("[Gather Database] Error fetching applications from Supabase:", err);
      throw new Error("Couldn't load your applications. Please check your connection.");
    }

    return [];
  },

  /**
   * Fetches a single application by ID from Supabase PostgreSQL.
   */
  async getApplication(id: string): Promise<Application | null> {
    if (!id) return null;

    try {
      let query = supabase
        .from("applications")
        .select(`
          id,
          organization_id,
          created_by,
          name,
          slug,
          description,
          status,
          is_public,
          public_id,
          published_at,
          cover_image,
          creation_prompt,
          ask_gather_history,
          settings,
          responses_count,
          created_at,
          updated_at,
          sections (
            id,
            application_id,
            title,
            description,
            position,
            created_at,
            updated_at,
            questions (
              id,
              section_id,
              application_id,
              label,
              type,
              required,
              placeholder,
              has_other,
              position,
              settings,
              created_at,
              updated_at,
              question_options (
                id,
                question_id,
                label,
                value,
                position,
                created_at
              )
            )
          )
        `);

      if (isUuid(id)) {
        query = query.or(`id.eq.${id},public_id.eq.${id}`);
      } else {
        query = query.or(`public_id.eq.${id},slug.eq.${id}`);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        return mapDbTreeToDomain(data as unknown as SupabaseApplicationTree);
      }
    } catch (err) {
      console.error(`[Gather Database] Error fetching application ${id}:`, err);
      throw new Error("Couldn't load the application.");
    }

    return null;
  },

  /**
   * Resolves a public application by slug or publicId from Supabase PostgreSQL.
   */
  async getApplicationBySlug(slugOrId: string): Promise<Application | null> {
    if (!slugOrId) return null;

    const cleanTarget = decodeURIComponent(slugOrId).toLowerCase().trim();

    try {
      let query = supabase
        .from("applications")
        .select(`
          id,
          organization_id,
          created_by,
          name,
          slug,
          description,
          status,
          is_public,
          public_id,
          published_at,
          cover_image,
          creation_prompt,
          ask_gather_history,
          settings,
          responses_count,
          created_at,
          updated_at,
          sections (
            id,
            application_id,
            title,
            description,
            position,
            created_at,
            updated_at,
            questions (
              id,
              section_id,
              application_id,
              label,
              type,
              required,
              placeholder,
              has_other,
              position,
              settings,
              created_at,
              updated_at,
              question_options (
                id,
                question_id,
                label,
                value,
                position,
                created_at
              )
            )
          )
        `);

      if (isUuid(cleanTarget)) {
        query = query.or(`slug.eq.${cleanTarget},public_id.eq.${cleanTarget},id.eq.${cleanTarget}`);
      } else {
        query = query.or(`slug.eq.${cleanTarget},public_id.eq.${cleanTarget}`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const apps = (data as unknown as SupabaseApplicationTree[]).map(mapDbTreeToDomain);
        if (apps.length > 1) {
          const published = apps.find((a) => a.status === "published");
          if (published) return published;
        }
        return apps[0];
      }
    } catch (err) {
      console.error(`[Gather Database] Error fetching application by slug ${slugOrId}:`, err);
    }

    return null;
  },

  /**
   * Creates a new application in Supabase PostgreSQL with sections, questions, and options.
   */
  async createApplication(
    name: string,
    description?: string,
    sections?: Section[],
    creationPrompt?: string,
    initialHistory?: AskGatherMessage[],
    customId?: string
  ): Promise<Application> {
    const cleanName = stripHtml(name) || "Untitled Form";
    const baseApp = createBaseApp(cleanName);
    const activeSections = sections !== undefined ? sections : baseApp.sections;
    const appId = ensureUuid(customId);
    const { userId, organizationId } = await resolveOrganizationAndUser();
    const baseSlug = createApplicationSlug(cleanName);
    const slug = await generateUniqueSlug(baseSlug);

    let history = initialHistory;
    if (!history && creationPrompt && creationPrompt.trim().length > 0) {
      const prompt = creationPrompt.trim();
      let assistantMsg = "";
      if (isValidFormCreationPrompt(prompt)) {
        assistantMsg = buildCreationSummary(cleanName, activeSections);
      } else if (isAmbiguousText(prompt)) {
        assistantMsg = "Sure — what would you like to improve? I can help with question wording, structure, sections, required fields, or answer types.";
      } else {
        assistantMsg = "It seems like your message isn't related to building or editing your form. I'm here to help you create and edit your form — for example, adding or removing questions, changing question types, editing sections, or improving your questions.\n\nWhat would you like to change?";
      }

      history = [
        {
          id: `msg-create-user-${Date.now()}`,
          role: "user" as const,
          content: prompt,
          createdAt: new Date().toISOString(),
        },
        {
          id: `msg-create-assistant-${Date.now() + 1}`,
          role: "assistant" as const,
          content: assistantMsg,
          createdAt: new Date().toISOString(),
          feedback: null,
          mutation: false,
        },
      ];
    }

    // 1. Insert Application into Supabase
    const { error: appError } = await supabase.from("applications").insert({
      id: appId,
      organization_id: organizationId,
      created_by: userId,
      name: cleanName,
      slug,
      description: description !== undefined ? description : baseApp.description,
      status: "draft",
      is_public: false,
      public_id: appId,
      creation_prompt: creationPrompt || null,
      ask_gather_history: (history || []) as any,
      settings: {
        endTime: { enabled: false },
        submissionLimit: { enabled: false },
        allowResponseEditing: false,
        defaultQuestionRequired: false,
      } as any,
      responses_count: 0,
    });

    if (appError) {
      console.error("[Gather Database] Error inserting application:", appError);
      throw new Error("Couldn't create the application in database.");
    }

    // 2. Insert Sections, Questions, and Options into Supabase
    const domainSections: Section[] = [];

    for (let sIdx = 0; sIdx < activeSections.length; sIdx++) {
      const sec = activeSections[sIdx];
      const secId = ensureUuid(sec.id);

      const { error: secError } = await supabase.from("sections").insert({
        id: secId,
        application_id: appId,
        title: stripHtml(sec.title) || "Section",
        position: sIdx,
      });

      if (secError) {
        console.error("[Gather Database] Error inserting section:", secError);
      }

      const domainQuestions: any[] = [];

      for (let qIdx = 0; qIdx < (sec.questions || []).length; qIdx++) {
        const q = sec.questions[qIdx];
        const qId = ensureUuid(q.id);

        const { error: qError } = await supabase.from("questions").insert({
          id: qId,
          section_id: secId,
          application_id: appId,
          label: q.label,
          type: q.type,
          required: Boolean(q.required),
          placeholder: q.placeholder || null,
          has_other: Boolean(q.hasOther),
          position: qIdx,
        });

        if (qError) {
          console.error("[Gather Database] Error inserting question:", qError);
        }

        if (q.options && Array.isArray(q.options) && q.options.length > 0) {
          const optionInserts = q.options.map((opt, optIdx) => ({
            id: ensureUuid(),
            question_id: qId,
            label: opt,
            value: opt,
            position: optIdx,
          }));
          const { error: optError } = await supabase.from("question_options").insert(optionInserts);
          if (optError) {
            console.error("[Gather Database] Error inserting question options:", optError);
          }
        }

        domainQuestions.push({
          id: qId,
          label: q.label,
          type: q.type,
          required: Boolean(q.required),
          placeholder: q.placeholder,
          hasOther: q.hasOther,
          options: q.options,
        });
      }

      domainSections.push({
        id: secId,
        title: sec.title,
        questions: domainQuestions,
      });
    }

    return {
      id: appId,
      name: cleanName,
      status: "draft",
      responses: 0,
      lastUpdated: "just now",
      isPublic: false,
      publicId: appId,
      slug,
      sections: domainSections,
      description: description !== undefined ? description : baseApp.description,
      creationPrompt: creationPrompt || undefined,
      askGatherHistory: history || [],
      settings: {
        endTime: { enabled: false },
        submissionLimit: { enabled: false },
        allowResponseEditing: false,
        defaultQuestionRequired: false,
      },
    };
  },

  /**
   * Updates an application and atomically syncs sections, questions, and options in Supabase.
   */
  async updateApplication(app: Application): Promise<Application> {
    const cleanName = stripHtml(app.name);
    let baseSlug = app.slug;
    if (!baseSlug || baseSlug === "untitled-form" || baseSlug.includes("<")) {
      baseSlug = createApplicationSlug(cleanName || "application");
    }
    const slug = await generateUniqueSlug(baseSlug, app.id);

    const appId = app.id;

    // 1. Update Application Row
    const { error: appError } = await supabase
      .from("applications")
      .update({
        name: app.name,
        slug,
        description: app.description || "",
        status: app.status,
        is_public: Boolean(app.isPublic),
        cover_image: app.coverImage || null,
        creation_prompt: app.creationPrompt || null,
        ask_gather_history: (app.askGatherHistory || []) as any,
        settings: (app.settings || {}) as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appId);

    if (appError) {
      console.error("[Gather Database] Error updating application:", appError);
      throw new Error("Couldn't save your changes. Please try again.");
    }

    // 2. Synchronize Sections, Questions & Options
    // Delete existing sections (cascade automatically removes child questions and options)
    await supabase.from("sections").delete().eq("application_id", appId);

    for (let sIdx = 0; sIdx < app.sections.length; sIdx++) {
      const sec = app.sections[sIdx];
      const secId = ensureUuid(sec.id);

      await supabase.from("sections").insert({
        id: secId,
        application_id: appId,
        title: sec.title,
        position: sIdx,
      });

      for (let qIdx = 0; qIdx < (sec.questions || []).length; qIdx++) {
        const q = sec.questions[qIdx];
        const qId = ensureUuid(q.id);

        await supabase.from("questions").insert({
          id: qId,
          section_id: secId,
          application_id: appId,
          label: q.label,
          type: q.type,
          required: Boolean(q.required),
          placeholder: q.placeholder || null,
          has_other: Boolean(q.hasOther),
          position: qIdx,
        });

        if (q.options && Array.isArray(q.options) && q.options.length > 0) {
          const optionInserts = q.options.map((opt, optIdx) => ({
            id: ensureUuid(),
            question_id: qId,
            label: opt,
            value: opt,
            position: optIdx,
          }));
          await supabase.from("question_options").insert(optionInserts);
        }
      }
    }

    return {
      ...app,
      name: app.name,
      slug,
      publicId: app.publicId || app.id,
      lastUpdated: "just now",
    };
  },

  /**
   * Publishes an application in Supabase.
   */
  async publishApplication(id: string): Promise<Application> {
    const target = await this.getApplication(id);
    if (!target) {
      throw new Error("Application not found.");
    }

    const cleanName = stripHtml(target.name);
    let slug = target.slug;
    if (!slug || slug === "untitled-form" || slug.includes("<")) {
      slug = createApplicationSlug(cleanName || "application");
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("applications")
      .update({
        status: "published",
        is_public: true,
        published_at: now,
        slug,
        public_id: target.publicId || target.id,
        updated_at: now,
      })
      .eq("id", id);

    if (error) {
      console.error("[Gather Database] Error publishing application:", error);
      throw new Error("Couldn't publish the application.");
    }

    return {
      ...target,
      status: "published",
      isPublic: true,
      publishedAt: now,
      slug,
      publicId: target.publicId || target.id,
      lastUpdated: "just now",
    };
  },

  /**
   * Unpublishes an application in Supabase.
   */
  async unpublishApplication(id: string): Promise<Application> {
    const target = await this.getApplication(id);
    if (!target) {
      throw new Error("Application not found.");
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("applications")
      .update({
        status: "draft",
        is_public: false,
        updated_at: now,
      })
      .eq("id", id);

    if (error) {
      console.error("[Gather Database] Error unpublishing application:", error);
      throw new Error("Couldn't unpublish the application.");
    }

    return {
      ...target,
      status: "draft",
      isPublic: false,
      lastUpdated: "just now",
    };
  },

  /**
   * Deletes an application and its cascaded children from Supabase.
   */
  async deleteApplication(id: string): Promise<void> {
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) {
      console.error("[Gather Database] Error deleting application:", error);
      throw new Error("Couldn't delete the application.");
    }
  },

  /**
   * Duplicates an application with completely new, independent UUIDs.
   */
  async duplicateApplication(app: Application): Promise<Application> {
    const cleanName = stripHtml(app.name);
    const copyName = `${cleanName} (copy)`;
    const newAppId = ensureUuid();

    const duplicatedSections: Section[] = app.sections.map((sec) => ({
      id: ensureUuid(),
      title: sec.title,
      questions: (sec.questions || []).map((q) => ({
        ...q,
        id: ensureUuid(),
        options: q.options ? [...q.options] : undefined,
      })),
    }));

    return this.createApplication(
      copyName,
      app.description,
      duplicatedSections,
      app.creationPrompt,
      app.askGatherHistory,
      newAppId
    );
  },
};
