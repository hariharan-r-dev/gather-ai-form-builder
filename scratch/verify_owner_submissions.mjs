import { createClient } from "@supabase/supabase-js";
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
const client = createClient(url, anonKey);

async function verifyOwner() {
  console.log("=== Authenticating as owner to verify submissions access ===");
  const email = "gathertest1788584168163@gmail.com";
  const password = "TestPassword123!";

  const { data: authData, error: authErr } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (authErr) {
    console.error("Sign in failed:", authErr.message);
    return;
  }

  console.log("SUCCESS: Authenticated as owner:", authData.user?.email);

  const appId = "52146dbb-ef8f-437d-ac11-3562c53b9378";

  const { data: subs, error: subErr } = await client
    .from("submissions")
    .select(`
      id,
      application_id,
      respondent_name,
      respondent_email,
      submitted_at,
      answers (
        id,
        question_label,
        question_type,
        answer_text,
        file_id
      ),
      files (
        id,
        original_filename,
        file_size_formatted,
        storage_path
      )
    `)
    .eq("application_id", appId)
    .order("submitted_at", { ascending: false });

  if (subErr) {
    console.error("Error fetching submissions as owner:", subErr);
  } else {
    console.log(`\nFound ${subs?.length || 0} submissions in Supabase PostgreSQL for application ${appId}:`);
    for (const s of subs || []) {
      console.log(`\n- Submission ID: ${s.id}`);
      console.log(`  Respondent Name: "${s.respondent_name}"`);
      console.log(`  Respondent Email: "${s.respondent_email}"`);
      console.log(`  Submitted At: ${s.submitted_at}`);
      console.log(`  Answers (${s.answers?.length || 0}):`);
      for (const a of s.answers || []) {
        console.log(`    * [${a.question_type}] ${a.question_label} = "${a.answer_text}"`);
      }
      if (s.files && s.files.length > 0) {
        console.log(`  Attached Files (${s.files.length}):`);
        for (const f of s.files) {
          console.log(`    * ${f.original_filename} (${f.file_size_formatted}, path: ${f.storage_path})`);
        }
      }
    }
  }
}

verifyOwner();
