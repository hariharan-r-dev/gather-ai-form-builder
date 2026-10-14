import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://coqkkheuittnjsvtymno.supabase.co";
const supabaseKey = "sb_publishable_HzwRtt2cCkvcK-wONpM2OQ_pdJMFFAy";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log("Checking Supabase connection...");
  
  // 1. Check if public database tables are accessible
  const { data: apps, error: appErr } = await supabase.from("applications").select("id, name, slug").limit(5);
  console.log("Applications query:", { apps, appErr });

  // 2. Test default workspace account from previous step
  const defaultEmail = "gathertest1788584168163@gmail.com";
  const defaultPassword = "TestPassword123!";
  
  console.log(`\nTesting login with ${defaultEmail}...`);
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
    email: defaultEmail,
    password: defaultPassword,
  });

  if (loginErr) {
    console.log("Default account login result:", loginErr.message);
  } else {
    console.log("Default account login successful! User:", loginData.user.email);
  }
}

testAuth();
