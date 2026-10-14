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

console.log("Supabase URL:", url);
console.log("Using Publishable/Anon Key (Anonymous Applicant Context)");

// Unauthenticated (anonymous) client
const anonClient = createClient(url, anonKey);

function isUuid(str) {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

async function getApplicationBySlug(slugOrId) {
  const cleanTarget = decodeURIComponent(slugOrId).toLowerCase().trim();
  let query = anonClient
    .from("applications")
    .select(`
      id,
      organization_id,
      created_by,
      name,
      slug,
      description,
      status,
      is_public,
      public_id,
      published_at,
      cover_image,
      creation_prompt,
      ask_gather_history,
      settings,
      responses_count,
      created_at,
      updated_at,
      sections (
        id,
        application_id,
        title,
        description,
        position,
        created_at,
        updated_at,
        questions (
          id,
          section_id,
          application_id,
          label,
          type,
          required,
          placeholder,
          has_other,
          position,
          settings,
          created_at,
          updated_at,
          question_options (
            id,
            question_id,
            label,
            value,
            position,
            created_at
          )
        )
      )
    `);

  if (isUuid(cleanTarget)) {
    query = query.or(`slug.eq.${cleanTarget},public_id.eq.${cleanTarget},id.eq.${cleanTarget}`);
  } else {
    query = query.or(`slug.eq.${cleanTarget},public_id.eq.${cleanTarget}`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Query error:", error);
    return null;
  }

  if (data && data.length > 0) {
    return data[0];
  }
  return null;
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("TEST 1: Fetch published application by slug (anonymous)");
  console.log("=======================================================");
  const slug = "junior-ux-designer-application";
  const app = await getApplicationBySlug(slug);

  if (!app) {
    console.error("FAIL: Published application returned null!");
    process.exit(1);
  }

  console.log("SUCCESS: Loaded application:", {
    id: app.id,
    name: app.name,
    slug: app.slug,
    status: app.status,
    is_public: app.is_public,
    sections_count: app.sections?.length,
  });

  // Verify sections and questions ordering
  const sections = (app.sections || []).sort((a, b) => a.position - b.position);
  console.log(`\nSections (${sections.length}):`);
  for (const sec of sections) {
    const questions = (sec.questions || []).sort((a, b) => a.position - b.position);
    console.log(`  [Section ${sec.position}] "${sec.title}" (${questions.length} questions):`);
    for (const q of questions) {
      const options = (q.question_options || []).sort((a, b) => a.position - b.position);
      console.log(`    - [Q${q.position}] [${q.type}] "${q.label}" (required: ${q.required}) ${options.length > 0 ? `[${options.length} options: ${options.map(o => o.label).join(", ")}]` : ""}`);
    }
  }

  console.log("\n=======================================================");
  console.log("TEST 2: Fetch draft application by slug (anonymous)");
  console.log("=======================================================");
  const draftApp = await getApplicationBySlug("supabase-test-application");
  if (draftApp) {
    console.error("SECURITY RISK FAIL: Draft application was accessible to anonymous user!", draftApp);
    process.exit(1);
  } else {
    console.log("SUCCESS: Draft application correctly returned null for anonymous user (RLS protected).");
  }

  console.log("\n=======================================================");
  console.log("TEST 3: Fetch by UUID directly (anonymous)");
  console.log("=======================================================");
  const byUuid = await getApplicationBySlug("52146dbb-ef8f-437d-ac11-3562c53b9378");
  if (!byUuid) {
    console.error("FAIL: Application lookup by UUID failed!");
    process.exit(1);
  } else {
    console.log("SUCCESS: Application lookup by UUID succeeded without 22P02 error:", byUuid.name);
  }

  console.log("\n=======================================================");
  console.log("ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY!");
  console.log("=======================================================");
}

runTests();
