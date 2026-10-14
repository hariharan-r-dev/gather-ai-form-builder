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

  await client.auth.signInWithPassword({
    email: "gathertest1788584168163@gmail.com",
    password: "TestPassword123!"
  });

  const { data: searchSub } = await client.from("submissions").select("*").eq("respondent_name", "Over Limit Applicant");
  console.log("Submissions created for rejected applicant:", searchSub);
}

main().catch(console.error);
