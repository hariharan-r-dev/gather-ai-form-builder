import { Submission, SubmissionAnswer } from "../../types";

const SUBMISSIONS_STORAGE_KEY = "gather_submissions";

function getStoredSubmissions(): Submission[] {
  const data = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveStoredSubmissions(submissions: Submission[]) {
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
}

function formatSubmissionDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[date.getMonth()];
  const d = date.getDate();
  return `${m} ${d}`;
}

export const submissionService = {
  async getSubmissions(applicationId: string): Promise<Submission[]> {
    const all = getStoredSubmissions();
    return all.filter((s) => s.applicationId === applicationId);
  },

  async getSubmission(submissionId: string): Promise<Submission | null> {
    const all = getStoredSubmissions();
    return all.find((s) => s.id === submissionId) || null;
  },

  async createSubmission(
    applicationId: string,
    answers: SubmissionAnswer[],
    nameInput?: string,
    emailInput?: string
  ): Promise<Submission> {
    const now = new Date();

    // Derive name and email if not provided directly
    let name = nameInput?.trim() || "";
    let email = emailInput?.trim() || "";

    if (!name || !email) {
      for (const ans of answers) {
        const qLower = ans.question.toLowerCase();
        if (!name && (qLower.includes("full name") || qLower.includes("name") || qLower === "your name")) {
          name = ans.answer;
        }
        if (!email && (qLower.includes("email") || ans.answer.includes("@"))) {
          email = ans.answer;
        }
      }
    }

    if (!name) name = "Anonymous Applicant";
    if (!email) email = "no-email@provided.com";

    const newSub: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      applicationId,
      name,
      email,
      submitted: formatSubmissionDate(now),
      submittedAt: now.toISOString(),
      answers,
      notes: "",
    };

    const all = getStoredSubmissions();
    saveStoredSubmissions([newSub, ...all]);

    return newSub;
  },

  async updateSubmissionNotes(submissionId: string, notes: string): Promise<Submission | null> {
    const all = getStoredSubmissions();
    const updated = all.map((s) => (s.id === submissionId ? { ...s, notes } : s));
    saveStoredSubmissions(updated);
    return updated.find((s) => s.id === submissionId) || null;
  },

  async deleteSubmission(submissionId: string): Promise<void> {
    const all = getStoredSubmissions();
    saveStoredSubmissions(all.filter((s) => s.id !== submissionId));
  },
};
