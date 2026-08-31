export type View =
  | "dashboard"
  | "applications-list"
  | "create"
  | "generating"
  | "editor"
  | "preview"
  | "publish"
  | "responses"
  | "applicant-detail"
  | "settings"
  | "app-settings"
  | "pricing"
  | "checkout"
  | "payment-success";

export type Plan = "free" | "pro";

export type AppStatus = "draft" | "published" | "closed";

export interface Question {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  hasOther?: boolean;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface FormSnapshot {
  name: string;
  description: string;
  sections: Section[];
}

export interface AskGatherMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  feedback?: "helpful" | "not_helpful" | null;
  mutation?: boolean;
  previousFormState?: FormSnapshot;
  undone?: boolean;
}

export type AIMessage = AskGatherMessage;

export interface Application {
  id: string;
  name: string;
  status: AppStatus;
  responses: number;
  lastUpdated: string;
  sections: Section[];
  description: string;
  slug: string;
  coverImage?: string;
  creationPrompt?: string;
  askGatherHistory?: AskGatherMessage[];
}

export interface SubmissionAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface Submission {
  id: string;
  applicationId: string;
  name: string;
  email: string;
  submitted: string;
  submittedAt?: string;
  answers: SubmissionAnswer[];
  notes: string;
}
