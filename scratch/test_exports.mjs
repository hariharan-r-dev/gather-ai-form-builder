import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { exportSubmissionsToExcel, exportSubmissionsToCSV, getFormQuestionColumns } from "../src/utils/exportSubmissions.ts";

async function main() {
  const envText = fs.readFileSync(".env", "utf-8");
  const env = {};
  for (const line of envText.split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && v.length) env[k.trim()] = v.join("=").trim();
  }
  const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

  await client.auth.signInWithPassword({
    email: "gathertest1788584168163@gmail.com",
    password: "TestPassword123!"
  });

  const appId = "52146dbb-ef8f-437d-ac11-3562c53b9378";

  // 1. Fetch Application with sections and questions
  const { data: appRow } = await client.from("applications").select("*").eq("id", appId).single();
  const { data: sections } = await client.from("sections").select("*, questions(*, question_options(*))").eq("application_id", appId).order("position");

  const app = {
    ...appRow,
    sections: (sections || []).map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      position: s.position,
      questions: (s.questions || []).map(q => ({
        id: q.id,
        label: q.label,
        type: q.type,
        required: q.required,
        options: (q.question_options || []).map(o => o.label)
      }))
    }))
  };

  // 2. Fetch Submissions with answers
  const { data: subs } = await client.from("submissions").select("*, answers(*)").eq("application_id", appId).order("submitted_at", { ascending: false });

  const mappedSubs = (subs || []).map(s => ({
    id: s.id,
    applicationId: s.application_id,
    name: s.respondent_name,
    email: s.respondent_email,
    submitted: "Recent",
    submittedAt: s.submitted_at,
    updatedAt: s.updated_at,
    notes: s.notes,
    answers: (s.answers || []).map(a => ({
      id: a.id,
      questionId: a.question_id,
      question: a.question_label,
      questionType: a.question_type,
      answer: a.answer_text
    }))
  }));

  console.log("Export test: App name:", app.name, "Sections count:", app.sections.length, "Submissions count:", mappedSubs.length);

  const qCols = getFormQuestionColumns(app);
  console.log("Question columns detected:", qCols.map(c => `${c.sectionTitle} -> ${c.questionLabel} (${c.questionType})`));

  console.log("Testing export functions logic complete.");
}

main().catch(console.error);
