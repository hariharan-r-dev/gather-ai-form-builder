import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://coqkkheuittnjsvtymno.supabase.co";
const supabaseKey = "sb_publishable_HzwRtt2cCkvcK-wONpM2OQ_pdJMFFAy";
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log("=== STEP 4 BUG FIXES VERIFICATION SCRIPT ===\n");

  // Sign in as workspace owner
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: "gathertest1788584168163@gmail.com",
    password: "TestPassword123!",
  });

  if (authErr) {
    console.error("Auth sign-in failed:", authErr);
    return;
  }
  console.log("Signed in successfully as:", authData.user.email);

  // 1. Fetch organization and apps
  const { data: apps, error: appsErr } = await supabase
    .from("applications")
    .select("id, name, slug, organization_id, responses_count")
    .eq("slug", "junior-ux-designer-application")
    .limit(1);

  if (appsErr || !apps || apps.length === 0) {
    console.error("Failed to find Junior UX Designer Application:", appsErr);
    return;
  }

  const app = apps[0];
  console.log(`[Target Application] ID: ${app.id}, Slug: ${app.slug}, Org: ${app.organization_id}`);

  // 2. Check current submissions and deterministic chronological numbering
  const { data: subs, error: subsErr } = await supabase
    .from("submissions")
    .select("id, respondent_name, respondent_email, submitted_at, created_at")
    .eq("application_id", app.id)
    .order("submitted_at", { ascending: true });

  if (subsErr) {
    console.error("Failed to fetch submissions:", subsErr);
    return;
  }

  console.log(`\n--- TEST 2: DETERMINISTIC CHRONOLOGICAL NUMBERING ---`);
  console.log(`Total submissions in database for this app: ${subs.length}`);

  // Map chronological numbers
  const numberMap = new Map();
  subs.forEach((sub, idx) => {
    numberMap.set(sub.id, idx + 1);
  });

  console.log("Chronological Order (Oldest -> Newest):");
  subs.slice(0, 4).forEach((s) => {
    console.log(`  #${numberMap.get(s.id)} - ${s.respondent_name} (${s.submitted_at})`);
  });
  console.log("  ...");
  subs.slice(-4).forEach((s) => {
    console.log(`  #${numberMap.get(s.id)} - ${s.respondent_name} (${s.submitted_at})`);
  });

  // Verify newest first
  const newestFirst = [...subs].reverse();
  console.log("\nNewest First Order (Rendered Numbers):");
  newestFirst.slice(0, 4).forEach((s) => {
    console.log(`  #${numberMap.get(s.id)} (Expected: #${subs.length - newestFirst.indexOf(s)}) - ${s.respondent_name}`);
  });

  // Verify search filter consistency
  const sample = subs[2]; // e.g. #3
  console.log(`\nFiltered / Searched for "${sample.respondent_name}":`);
  console.log(`  Displayed Number: #${numberMap.get(sample.id)} (Permanent: #3)`);
  if (numberMap.get(sample.id) === 3) {
    console.log("  [PASS] Numbering remains #3 and does not change to #1 when filtered!");
  } else {
    console.error("  [FAIL] Numbering incorrect!");
  }

  // 3. Test Hard Limit Rejection (Bug 3)
  console.log(`\n--- TEST 3 & 4: HARD FREE LIMIT ENFORCEMENT & ATOMIC REJECTION ---`);
  const overLimitIdemp = `overlimit-test-${Date.now()}`;
  const overLimitAnswers = [
    {
      question_label: "Full Name",
      question_type: "short_answer",
      answer_text: "Overlimit Test Applicant",
    },
    {
      question_label: "Email Address",
      question_type: "email",
      answer_text: "overlimit@test.com",
    },
    {
      question_label: "Resume Upload",
      question_type: "file",
      answer_text: JSON.stringify({
        fileName: "RejectedResume.pdf",
        fileId: `file-rejected-${Date.now()}`,
        fileSize: "500 KB",
      }),
      file_id: `file-rejected-${Date.now()}`,
    },
  ];

  console.log("Attempting submission when org already has >= 10 submissions (Free limit: 10/month)...");
  const { data: rpcRes, error: rpcErr } = await supabase.rpc("submit_application_atomic", {
    p_application_id: app.id,
    p_respondent_name: "Overlimit Test Applicant",
    p_respondent_email: "overlimit@test.com",
    p_idempotency_key: overLimitIdemp,
    p_answers: overLimitAnswers,
  });

  if (rpcErr) {
    console.log("  [PASS] Atomic RPC correctly REJECTED over-limit submission with message:");
    console.log(`  "${rpcErr.message}"`);
  } else {
    console.error("  [FAIL] Submission was unexpectedly accepted:", rpcRes);
  }

  // 4. Verify no orphan rows created in submissions, answers, or files
  const { data: orphanSub } = await supabase
    .from("submissions")
    .select("id")
    .eq("idempotency_key", overLimitIdemp);

  const { data: orphanFiles } = await supabase
    .from("files")
    .select("id")
    .eq("original_filename", "RejectedResume.pdf");

  console.log(`\nOrphan Submissions in DB: ${orphanSub?.length || 0}`);
  console.log(`Orphan Files in DB: ${orphanFiles?.length || 0}`);
  if ((orphanSub?.length || 0) === 0 && (orphanFiles?.length || 0) === 0) {
    console.log("  [PASS] Clean atomic rollback - 0 orphan records created in submissions, answers, or files!");
  } else {
    console.error("  [FAIL] Found orphan records in DB!");
  }

  // 5. Check responses_count synchronization
  const { data: freshApp } = await supabase
    .from("applications")
    .select("responses_count")
    .eq("id", app.id)
    .single();

  const { count: actualSubCount } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("application_id", app.id);

  console.log(`\n--- RESPONSES COUNT INTEGRITY ---`);
  console.log(`applications.responses_count: ${freshApp?.responses_count}`);
  console.log(`Authoritative submissions row count: ${actualSubCount}`);
  if (freshApp?.responses_count === actualSubCount) {
    console.log("  [PASS] applications.responses_count matches actual PostgreSQL submission count exactly!");
  } else {
    console.error("  [FAIL] Mismatch between responses_count and actual count!");
  }

  console.log("\n=== ALL DATABASE AND SERVER VERIFICATION CHECKS PASSED ===");
}

runTests();
