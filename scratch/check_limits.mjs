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

  const { data: orgs } = await client.from("organizations").select("*");
  console.log("Organizations:", orgs);

  const { data: subs } = await client.from("subscriptions").select("*");
  console.log("Subscriptions:", subs);

  const { data: usages } = await client.from("usage_records").select("*");
  console.log("Usage records:", usages);

  const { data: allSubmissions } = await client
    .from("submissions")
    .select("id, application_id, respondent_name, submitted_at")
    .order("submitted_at", { ascending: true });

  console.log("All submissions count:", allSubmissions?.length);
  if (allSubmissions) {
    allSubmissions.forEach((s, idx) => {
      console.log(`#${idx + 1} ${s.id} - ${s.respondent_name} (${s.submitted_at})`);
    });
  }
}

main().catch(console.error);
