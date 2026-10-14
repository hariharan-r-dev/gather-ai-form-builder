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

  console.log("Testing submission on free account with >= 10 submissions...");
  const { data, error } = await client.rpc("submit_application_atomic", {
    p_application_id: appId,
    p_respondent_name: "Over Limit Applicant",
    p_respondent_email: "over.limit@example.com",
    p_idempotency_key: "test-over-limit-" + Date.now(),
    p_answers: [
      { question_label: "First name", question_type: "short_answer", answer_text: "OverLimit" }
    ]
  });

  console.log("Result:", data);
  console.log("Expected Error caught:", error?.message);
}

main().catch(console.error);
