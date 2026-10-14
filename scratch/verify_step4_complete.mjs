import { createClient } from "@supabase/supabase-js";
import fs from "fs";

async function main() {
  const envText = fs.readFileSync(".env", "utf-8");
  const env = {};
  for (const line of envText.split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && v.length) env[k.trim()] = v.join("=").trim();
  }
  const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

  const appId = "52146dbb-ef8f-437d-ac11-3562c53b9378";

  console.log("--- 1. Testing Marcus Vance Submission ---");
  const idempKey1 = "marcus-idemp-" + Date.now();
  const fileId1 = "file-marcus-" + Date.now();

  const { data: subRes1, error: err1 } = await client.rpc("submit_application_atomic", {
    p_application_id: appId,
    p_respondent_name: "Marcus Vance",
    p_respondent_email: "marcus.vance@example.com",
    p_idempotency_key: idempKey1,
    p_answers: [
      { question_label: "First name", question_type: "short_answer", answer_text: "Marcus" },
      { question_label: "Last name", question_type: "short_answer", answer_text: "Vance" },
      { question_label: "Phone Number", question_type: "phone", answer_text: "+1 555-0988" },
      { question_label: "Email", question_type: "email", answer_text: "marcus.vance@example.com" },
      { question_label: "LinkedIn Profile URL", question_type: "url", answer_text: "https://linkedin.com/in/marcusvance" },
      { question_label: "Years of UX Design Experience", question_type: "number", answer_text: "4" },
      {
        question_label: "Resume Upload",
        question_type: "file",
        answer_text: JSON.stringify({
          fileId: fileId1,
          fileName: "Marcus_Vance_Resume.pdf",
          fileSize: "1.1 MB",
          fileType: "application/pdf",
          sizeBytes: 1153433,
          storagePath: "submissions/marcus/" + fileId1
        }),
        file_id: fileId1,
        file_metadata: {
          file_id: fileId1,
          file_name: "Marcus_Vance_Resume.pdf",
          mime_type: "application/pdf",
          size_bytes: 1153433,
          file_size_formatted: "1.1 MB",
          storage_path: "submissions/marcus/" + fileId1
        }
      },
      { question_label: "Highest Level of Education", question_type: "single_choice", answer_text: "Bachelor's Degree" }
    ]
  });
  console.log("Marcus Vance submission result:", subRes1, "Error:", err1);

  console.log("--- 2. Testing Duplicate Idempotency Retry ---");
  const { data: subResDup, error: errDup } = await client.rpc("submit_application_atomic", {
    p_application_id: appId,
    p_respondent_name: "Marcus Vance",
    p_respondent_email: "marcus.vance@example.com",
    p_idempotency_key: idempKey1,
    p_answers: []
  });
  console.log("Duplicate Retry Result:", subResDup, "is_duplicate:", subResDup?.is_duplicate);

  console.log("--- 3. Testing Login and Verification of Saved Submission in DB ---");
  await client.auth.signInWithPassword({
    email: "gathertest1788584168163@gmail.com",
    password: "TestPassword123!"
  });

  const { data: subRow, error: subRowErr } = await client
    .from("submissions")
    .select("id, respondent_name, respondent_email, submitted_at, notes, answers(id, question_label, question_type, answer_text, file_id)")
    .eq("id", subRes1?.submission_id)
    .single();
  console.log("Saved submission verification in DB:", {
    id: subRow?.id,
    name: subRow?.respondent_name,
    email: subRow?.respondent_email,
    submitted_at: subRow?.submitted_at,
    answers_count: subRow?.answers?.length
  });

  console.log("--- 4. Testing File Record Verification in DB ---");
  const { data: fileRow } = await client.from("files").select("*").eq("file_id", fileId1).single();
  console.log("File row in DB:", fileRow);

  console.log("--- 5. Testing Notes Updating ---");
  const { error: noteErr } = await client
    .from("submissions")
    .update({ notes: "Shortlisted for technical interview.", updated_at: new Date().toISOString() })
    .eq("id", subRes1?.submission_id);
  console.log("Note update error:", noteErr);

  const { data: subWithNote } = await client.from("submissions").select("notes").eq("id", subRes1?.submission_id).single();
  console.log("Updated note in DB:", subWithNote?.notes);

  console.log("--- 6. Testing Application Responses Count Sync ---");
  const { data: appRow } = await client.from("applications").select("id, responses_count").eq("id", appId).single();
  const { count: totalSubCount } = await client.from("submissions").select("id", { count: "exact", head: true }).eq("application_id", appId);
  console.log("App responses_count:", appRow?.responses_count, "Total DB submissions count:", totalSubCount, "Exact match:", appRow?.responses_count === totalSubCount);
}

main().catch(console.error);
