import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://coqkkheuittnjsvtymno.supabase.co";
const supabaseKey = "sb_publishable_HzwRtt2cCkvcK-wONpM2OQ_pdJMFFAy";
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectWithAuth() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: "gathertest1788584168163@gmail.com",
    password: "TestPassword123!",
  });

  if (authErr) {
    console.error("Auth sign-in failed:", authErr);
    return;
  }
  console.log("Signed in successfully as:", authData.user.email);

  const { data: orgs } = await supabase.from("organizations").select("id, name");
  console.log("Organizations:", orgs);

  const { data: allSubs, error: subsErr } = await supabase
    .from("submissions")
    .select("id, application_id, respondent_name, submitted_at")
    .order("submitted_at", { ascending: true });

  console.log(`Total submissions in DB for org: ${allSubs?.length}`);
  console.log("Submissions list:");
  allSubs?.forEach((s, idx) => {
    console.log(`  #${idx + 1}: ${s.respondent_name} (${s.submitted_at}) [ID: ${s.id}]`);
  });
}

inspectWithAuth();
