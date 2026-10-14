import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://coqkkheuittnjsvtymno.supabase.co";
const supabaseKey = "sb_publishable_HzwRtt2cCkvcK-wONpM2OQ_pdJMFFAy";
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAll() {
  const { data: apps } = await supabase.from("applications").select("id, name, slug, organization_id, responses_count");
  console.log("All Applications:", apps);

  const { data: allSubs } = await supabase.from("submissions").select("id, application_id, respondent_name, submitted_at");
  console.log(`Total submissions in entire DB: ${allSubs?.length}`);
  console.log("Submissions list:", allSubs);

  const { data: orgs } = await supabase.from("organizations").select("id, name");
  console.log("Organizations:", orgs);
}

inspectAll();
