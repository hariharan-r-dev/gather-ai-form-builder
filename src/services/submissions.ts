import { supabase } from "../lib/supabase";
import { Submission, SubmissionAnswer } from "../types";
import { DbSubmission, DbAnswer, mapDbSubmissionToDomain } from "../types/database";
import { ensureUuid, isUuid } from "./applications/applicationMapper";
import { parseFileAnswer } from "../components/common/FileUploadField";

function formatSubmissionDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[date.getMonth()];
  const d = date.getDate();
  return `${m} ${d}`;
}

export const submissionService = {
  /**
   * Fetches all submissions for an application from Supabase PostgreSQL.
   */
  async getSubmissions(applicationId: string): Promise<Submission[]> {
    if (!applicationId) return [];

    try {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          id,
          application_id,
          respondent_name,
          respondent_email,
          notes,
          idempotency_key,
          submitted_at,
          updated_at,
          created_at,
          answers (
            id,
            submission_id,
            question_id,
            question_label,
            question_type,
            answer_text,
            answer_json,
            file_id,
            created_at
          )
        `)
        .eq("application_id", applicationId)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("[Gather Submissions] Error fetching submissions:", error);
        throw error;
      }

      if (data && Array.isArray(data)) {
        return data.map((sub: any) =>
          mapDbSubmissionToDomain(sub as DbSubmission, (sub.answers || []) as DbAnswer[])
        );
      }
    } catch (err) {
      console.error("[Gather Submissions] Error reading submissions:", err);
      throw new Error("Couldn't load submissions.");
    }

    return [];
  },

  /**
   * Fetches a single submission with all its answers from Supabase PostgreSQL.
   */
  async getSubmission(submissionId: string): Promise<Submission | null> {
    if (!submissionId) return null;

    try {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          id,
          application_id,
          respondent_name,
          respondent_email,
          notes,
          idempotency_key,
          submitted_at,
          updated_at,
          created_at,
          answers (
            id,
            submission_id,
            question_id,
            question_label,
            question_type,
            answer_text,
            answer_json,
            file_id,
            created_at
          )
        `)
        .eq("id", submissionId)
        .maybeSingle();

      if (error) {
        console.error("[Gather Submissions] Error fetching submission:", error);
        throw error;
      }

      if (data) {
        return mapDbSubmissionToDomain(data as unknown as DbSubmission, (data.answers || []) as DbAnswer[]);
      }
    } catch (err) {
      console.error(`[Gather Submissions] Error reading submission ${submissionId}:`, err);
      throw new Error("Couldn't load applicant details.");
    }

    return null;
  },

  /**
   * Returns the count of submissions for an application.
   */
  async getSubmissionCount(applicationId: string): Promise<number> {
    if (!applicationId) return 0;

    try {
      const { count, error } = await supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .eq("application_id", applicationId);

      if (error) {
        console.error("[Gather Submissions] Error counting submissions:", error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error("[Gather Submissions] Error getting submission count:", err);
      return 0;
    }
  },

  /**
   * Creates a new submission and persists answers to Supabase PostgreSQL using atomic RPC.
   */
  async createSubmission(
    applicationId: string,
    answers: SubmissionAnswer[],
    nameInput?: string,
    emailInput?: string,
    idempotencyKey?: string
  ): Promise<Submission> {
    if (!applicationId) {
      throw new Error("Application ID is required.");
    }

    const now = new Date();
    const nowIso = now.toISOString();

    // 1. Derive respondent name and email if not explicitly provided
    let name = nameInput?.trim() || "";
    let email = emailInput?.trim() || "";

    if (!name || !email) {
      let firstName = "";
      let lastName = "";

      for (const ans of answers) {
        const qLower = (ans.question || "").toLowerCase().trim();
        const ansVal = (ans.answer || "").trim();

        if (qLower === "first name" || qLower.startsWith("first name")) {
          firstName = ansVal;
        } else if (qLower === "last name" || qLower.startsWith("last name")) {
          lastName = ansVal;
        } else if (!name && (qLower.includes("full name") || qLower === "your name" || qLower === "name")) {
          name = ansVal;
        }

        if (!email && (qLower.includes("email") || ansVal.includes("@"))) {
          email = ansVal;
        }
      }

      if (!name && (firstName || lastName)) {
        name = `${firstName} ${lastName}`.trim();
      }
    }

    if (!name) name = "Anonymous Applicant";
    if (!email) email = "no-email@provided.com";

    // 2. Prepare structured answer payload for atomic RPC
    const structuredAnswers = (answers || []).map((ans) => {
      const parsedFile = parseFileAnswer(ans.answer);
      const fileId = parsedFile?.fileId || null;
      return {
        question_id: isUuid(ans.questionId) ? ans.questionId : null,
        question_label: ans.question || "",
        question_type: ans.questionType || "short_answer",
        answer_text: ans.answer || "",
        answer_json: parsedFile ? (parsedFile as any) : null,
        file_id: fileId,
        file_metadata: parsedFile && fileId ? {
          file_id: parsedFile.fileId,
          file_name: parsedFile.fileName || "uploaded_file",
          file_type: parsedFile.fileType || "application/octet-stream",
          size_bytes: parsedFile.sizeBytes || 0,
          file_size_formatted: parsedFile.fileSize || null,
          storage_path: parsedFile.storagePath || `uploads/${parsedFile.fileId}`,
        } : null,
      };
    });

    // 3. Call server-authoritative atomic RPC function
    try {
      const { data: rpcResult, error: rpcError } = await (supabase.rpc as any)("submit_application_atomic", {
        p_application_id: applicationId,
        p_respondent_name: name,
        p_respondent_email: email,
        p_idempotency_key: idempotencyKey || null,
        p_answers: structuredAnswers,
      });

      if (rpcError) {
        console.error("[Gather Submissions] RPC submission error:", rpcError);
        // Extract readable error message from postgres exception
        const msg = rpcError.message || rpcError.details || "Submission failed.";
        throw new Error(msg);
      }

      const submissionId = rpcResult?.submission_id || ensureUuid();
      const submittedAt = rpcResult?.submitted_at || nowIso;

      return {
        id: submissionId,
        applicationId,
        name: rpcResult?.respondent_name || name,
        email: rpcResult?.respondent_email || email,
        submitted: formatSubmissionDate(new Date(submittedAt)),
        submittedAt,
        updatedAt: submittedAt,
        answers,
        notes: "",
      };
    } catch (err: any) {
      if (err?.message && (
        err.message.includes("deadline") ||
        err.message.includes("limit") ||
        err.message.includes("closed") ||
        err.message.includes("not accepting")
      )) {
        throw err;
      }

      console.error("[Gather Submissions] Falling back to direct database insertion:", err);

      // Fallback: Direct database insert if RPC is unavailable
      const subId = ensureUuid();
      const { error: subError } = await (supabase.from("submissions") as any).insert({
        id: subId,
        application_id: applicationId,
        respondent_name: name,
        respondent_email: email,
        notes: "",
        idempotency_key: idempotencyKey || null,
        submitted_at: nowIso,
        updated_at: nowIso,
      });

      if (subError) {
        console.error("[Gather Submissions] Direct insert failed:", subError);
        throw new Error(subError.message || "Failed to submit your application. Please check your connection.");
      }

      if (answers && answers.length > 0) {
        const answerRows: any[] = [];
        const fileRows: any[] = [];

        for (const ans of answers) {
          const ansId = ensureUuid();
          const parsedFile = parseFileAnswer(ans.answer);
          let fileId: string | null = null;

          if (parsedFile && parsedFile.fileId) {
            fileId = parsedFile.fileId;
            fileRows.push({
              id: ensureUuid(),
              application_id: applicationId,
              submission_id: subId,
              question_id: isUuid(ans.questionId) ? ans.questionId : null,
              file_id: parsedFile.fileId,
              storage_path: parsedFile.storagePath || `submissions/${subId}/${parsedFile.fileId}`,
              original_filename: parsedFile.fileName || "uploaded_file",
              mime_type: parsedFile.fileType || "application/octet-stream",
              size_bytes: parsedFile.sizeBytes || 0,
              file_size_formatted: parsedFile.fileSize || null,
            });
          }

          answerRows.push({
            id: ansId,
            submission_id: subId,
            question_id: isUuid(ans.questionId) ? ans.questionId : null,
            question_label: ans.question || "",
            question_type: ans.questionType || "short_answer",
            answer_text: ans.answer || "",
            answer_json: parsedFile ? (parsedFile as any) : null,
            file_id: fileId,
          });
        }

        if (fileRows.length > 0) {
          await (supabase.from("files") as any).insert(fileRows).catch(() => {});
        }

        await (supabase.from("answers") as any).insert(answerRows);
      }

      return {
        id: subId,
        applicationId,
        name,
        email,
        submitted: formatSubmissionDate(now),
        submittedAt: nowIso,
        updatedAt: nowIso,
        answers,
        notes: "",
      };
    }
  },

  /**
   * Updates an existing submission and its answers in Supabase PostgreSQL.
   */
  async updateSubmission(
    submissionId: string,
    answers: SubmissionAnswer[],
    nameInput?: string,
    emailInput?: string
  ): Promise<Submission | null> {
    if (!submissionId) return null;

    const existing = await this.getSubmission(submissionId);
    if (!existing) return null;

    const now = new Date();
    const nowIso = now.toISOString();

    let name = nameInput?.trim() || existing.name;
    let email = emailInput?.trim() || existing.email;

    if (!name || !email) {
      for (const ans of answers) {
        const qLower = (ans.question || "").toLowerCase().trim();
        if (!name && (qLower.includes("full name") || qLower.includes("name"))) {
          name = ans.answer;
        }
        if (!email && (qLower.includes("email") || ans.answer.includes("@"))) {
          email = ans.answer;
        }
      }
    }

    // 1. Update submission row
    const { error: subErr } = await supabase
      .from("submissions")
      .update({
        respondent_name: name,
        respondent_email: email,
        updated_at: nowIso,
      })
      .eq("id", submissionId);

    if (subErr) {
      console.error("[Gather Submissions] Error updating submission:", subErr);
      throw new Error("Couldn't update your submission.");
    }

    // 2. Re-synchronize answers
    await supabase.from("answers").delete().eq("submission_id", submissionId);

    if (answers && answers.length > 0) {
      const answerRows = answers.map((ans) => {
        const parsedFile = parseFileAnswer(ans.answer);
        return {
          id: ensureUuid(),
          submission_id: submissionId,
          question_id: isUuid(ans.questionId) ? ans.questionId : null,
          question_label: ans.question || "",
          question_type: ans.questionType || "short_answer",
          answer_text: ans.answer || "",
          answer_json: parsedFile ? (parsedFile as any) : null,
          file_id: parsedFile?.fileId || null,
        };
      });

      await supabase.from("answers").insert(answerRows);
    }

    return {
      ...existing,
      name,
      email,
      answers,
      updatedAt: nowIso,
    };
  },

  /**
   * Updates reviewer notes on a submission in Supabase PostgreSQL.
   */
  async updateSubmissionNotes(submissionId: string, notes: string): Promise<Submission | null> {
    if (!submissionId) return null;

    const { error } = await supabase
      .from("submissions")
      .update({
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (error) {
      console.error("[Gather Submissions] Error updating notes:", error);
      throw new Error("Couldn't save notes.");
    }

    return this.getSubmission(submissionId);
  },

  /**
   * Deletes a submission from Supabase PostgreSQL (cascades to answers and updates counter).
   */
  async deleteSubmission(submissionId: string): Promise<void> {
    if (!submissionId) return;

    const { error } = await supabase.from("submissions").delete().eq("id", submissionId);
    if (error) {
      console.error("[Gather Submissions] Error deleting submission:", error);
      throw new Error("Couldn't delete submission.");
    }
  },
};
