import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import fs from "fs";

const envContent = fs.readFileSync(".env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    value = value.trim().replace(/^['"](.*)['"]$/, "$1");
    env[match[1]] = value;
  }
});

const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const anonClient = createClient(url, anonKey);

const appId = "52146dbb-ef8f-437d-ac11-3562c53b9378";

async function testSubmissionInsert() {
  console.log("=== Testing Anonymous Submission Creation without .select() ===");

  const subId = crypto.randomUUID();

  // 1. Insert Submission with client-generated UUID
  const { error: subErr } = await anonClient
    .from("submissions")
    .insert({
      id: subId,
      application_id: appId,
      respondent_name: "Test Applicant Anonymous",
      respondent_email: "test.applicant@example.com",
      notes: "",
    });

  if (subErr) {
    console.error("FAIL: Error inserting submission:", subErr);
    return;
  }

  console.log("SUCCESS: Created submission ID:", subId);

  // 2. Insert Answers
  const answersToInsert = [
    {
      id: crypto.randomUUID(),
      submission_id: subId,
      question_id: "1038f779-ffd5-409c-a6cf-a92024d56b6e",
      question_label: "First name",
      question_type: "short_answer",
      answer_text: "Jane",
    },
    {
      id: crypto.randomUUID(),
      submission_id: subId,
      question_id: "dcf75cb8-eb94-4f8d-900b-1ff2971f235c",
      question_label: "Last name",
      question_type: "short_answer",
      answer_text: "Doe",
    },
  ];

  const { error: ansErr } = await anonClient
    .from("answers")
    .insert(answersToInsert);

  if (ansErr) {
    console.error("FAIL: Error inserting answers:", ansErr);
  } else {
    console.log("SUCCESS: Inserted answers without error!");
  }
}

testSubmissionInsert();
