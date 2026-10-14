import { Application, Section, Question, Submission, SubmissionAnswer, AppStatus, FormSettings, AskGatherMessage } from "../types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          updated_at?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          created_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "member";
        };
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          provider: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: "free" | "pro";
          status: "active" | "trialing" | "canceled" | "past_due" | "unpaid" | "incomplete";
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          provider?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: "free" | "pro";
          status?: "active" | "trialing" | "canceled" | "past_due" | "unpaid" | "incomplete";
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan?: "free" | "pro";
          status?: "active" | "trialing" | "canceled" | "past_due" | "unpaid" | "incomplete";
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
      };
      usage_records: {
        Row: {
          id: string;
          organization_id: string;
          billing_cycle_start: string;
          billing_cycle_end: string;
          submission_count: number;
          submission_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          billing_cycle_start?: string;
          billing_cycle_end?: string;
          submission_count?: number;
          submission_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          submission_count?: number;
          submission_limit?: number;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          organization_id: string;
          created_by: string | null;
          name: string;
          slug: string;
          description: string;
          status: AppStatus;
          is_public: boolean;
          public_id: string | null;
          published_at: string | null;
          cover_image: string | null;
          creation_prompt: string | null;
          ask_gather_history: Json;
          settings: Json;
          responses_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          created_by?: string | null;
          name: string;
          slug: string;
          description?: string;
          status?: AppStatus;
          is_public?: boolean;
          public_id?: string | null;
          published_at?: string | null;
          cover_image?: string | null;
          creation_prompt?: string | null;
          ask_gather_history?: Json;
          settings?: Json;
          responses_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          status?: AppStatus;
          is_public?: boolean;
          public_id?: string | null;
          published_at?: string | null;
          cover_image?: string | null;
          creation_prompt?: string | null;
          ask_gather_history?: Json;
          settings?: Json;
          responses_count?: number;
          updated_at?: string;
        };
      };
      sections: {
        Row: {
          id: string;
          application_id: string;
          title: string;
          description: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          title: string;
          description?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          position?: number;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          section_id: string;
          application_id: string;
          label: string;
          type: string;
          required: boolean;
          placeholder: string | null;
          has_other: boolean | null;
          position: number;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          application_id: string;
          label: string;
          type: string;
          required?: boolean;
          placeholder?: string | null;
          has_other?: boolean | null;
          position?: number;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          section_id?: string;
          label?: string;
          type?: string;
          required?: boolean;
          placeholder?: string | null;
          has_other?: boolean | null;
          position?: number;
          settings?: Json;
          updated_at?: string;
        };
      };
      question_options: {
        Row: {
          id: string;
          question_id: string;
          label: string;
          value: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          label: string;
          value: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          label?: string;
          value?: string;
          position?: number;
        };
      };
      submissions: {
        Row: {
          id: string;
          application_id: string;
          respondent_name: string;
          respondent_email: string;
          notes: string;
          idempotency_key: string | null;
          submitted_at: string;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          respondent_name?: string;
          respondent_email?: string;
          notes?: string;
          idempotency_key?: string | null;
          submitted_at?: string;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          respondent_name?: string;
          respondent_email?: string;
          notes?: string;
          updated_at?: string;
        };
      };
      files: {
        Row: {
          id: string;
          application_id: string;
          submission_id: string | null;
          question_id: string | null;
          file_id: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          file_size_formatted: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          submission_id?: string | null;
          question_id?: string | null;
          file_id: string;
          storage_path: string;
          original_filename: string;
          mime_type?: string;
          size_bytes?: number;
          file_size_formatted?: string | null;
          created_at?: string;
        };
        Update: {
          submission_id?: string | null;
          question_id?: string | null;
          file_size_formatted?: string | null;
        };
      };
      answers: {
        Row: {
          id: string;
          submission_id: string;
          question_id: string | null;
          question_label: string;
          question_type: string;
          answer_text: string;
          answer_json: Json | null;
          file_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          question_id?: string | null;
          question_label: string;
          question_type: string;
          answer_text?: string;
          answer_json?: Json | null;
          file_id?: string | null;
          created_at?: string;
        };
        Update: {
          answer_text?: string;
          answer_json?: Json | null;
          file_id?: string | null;
        };
      };
    };
  };
}

export type DbProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type DbOrganization = Database["public"]["Tables"]["organizations"]["Row"];
export type DbSubscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type DbUsageRecord = Database["public"]["Tables"]["usage_records"]["Row"];
export type DbApplication = Database["public"]["Tables"]["applications"]["Row"];
export type DbSection = Database["public"]["Tables"]["sections"]["Row"];
export type DbQuestion = Database["public"]["Tables"]["questions"]["Row"];
export type DbQuestionOption = Database["public"]["Tables"]["question_options"]["Row"];
export type DbSubmission = Database["public"]["Tables"]["submissions"]["Row"];
export type DbAnswer = Database["public"]["Tables"]["answers"]["Row"];
export type DbFile = Database["public"]["Tables"]["files"]["Row"];

// ==============================================================================
// Domain <-> Database Mappers
// ==============================================================================

export function mapDbApplicationToDomain(
  dbApp: DbApplication,
  sections: Section[] = []
): Application {
  return {
    id: dbApp.id,
    name: dbApp.name,
    status: dbApp.status,
    responses: dbApp.responses_count,
    lastUpdated: "just now",
    publishedAt: dbApp.published_at || undefined,
    isPublic: dbApp.is_public,
    publicId: dbApp.public_id || dbApp.id,
    slug: dbApp.slug,
    sections,
    description: dbApp.description,
    coverImage: dbApp.cover_image || undefined,
    creationPrompt: dbApp.creation_prompt || undefined,
    askGatherHistory: (dbApp.ask_gather_history as unknown as AskGatherMessage[]) || [],
    settings: (dbApp.settings as unknown as FormSettings) || undefined,
  };
}

export function mapDbSubmissionToDomain(
  dbSub: DbSubmission,
  dbAnswers: DbAnswer[] = []
): Submission {
  const answers: SubmissionAnswer[] = dbAnswers.map((a) => ({
    questionId: a.question_id || "",
    question: a.question_label,
    questionType: a.question_type,
    answer: a.answer_text,
  }));

  const d = new Date(dbSub.submitted_at);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const submittedFormatted = !isNaN(d.getTime()) ? `${months[d.getMonth()]} ${d.getDate()}` : "Recently";

  return {
    id: dbSub.id,
    applicationId: dbSub.application_id,
    name: dbSub.respondent_name,
    email: dbSub.respondent_email,
    submitted: submittedFormatted,
    submittedAt: dbSub.submitted_at,
    updatedAt: dbSub.updated_at,
    answers,
    notes: dbSub.notes,
  };
}
