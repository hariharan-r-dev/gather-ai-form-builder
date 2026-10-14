import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.VITE_SUPABASE_URL!;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY!;

// Unauthenticated (anonymous) client
const anonClient = createClient(url, anonKey);

async function runTests() {
  console.log("=== Step 1: Query published application by slug (anonymous) ===");
  const { data: publishedApps, error: pubErr } = await anonClient
    .from("applications")
    .select(`
      id,
      name,
      slug,
      status,
      is_public,
      sections (
        id,
        title,
        position,
        questions (
          id,
          label,
          type,
          required,
          placeholder,
          position,
          question_options (
            id,
            label,
            value,
            position
          )
        )
      )
    `)
    .or("slug.eq.junior-ux-designer-application,public_id.eq.junior-ux-designer-application");

  if (pubErr) {
    console.error("FAIL: Error fetching published app:", pubErr);
  } else if (!publishedApps || publishedApps.length === 0) {
    console.error("FAIL: Published app not found!");
  } else {
    const app = publishedApps[0];
    console.log("SUCCESS: Found published app:", app.name, `(${app.id})`);
    console.log(`Sections count: ${app.sections?.length}`);
    let totalQuestions = 0;
    let totalOptions = 0;
    for (const sec of app.sections || []) {
      totalQuestions += sec.questions?.length || 0;
      for (const q of sec.questions || []) {
        totalOptions += (q as any).question_options?.length || 0;
      }
    }
    console.log(`Total questions: ${totalQuestions}, Total options: ${totalOptions}`);
  }

  console.log("\n=== Step 2: Query draft/private application by slug (anonymous) ===");
  const { data: draftApps, error: draftErr } = await anonClient
    .from("applications")
    .select("id, name, slug, status, is_public")
    .or("slug.eq.supabase-test-application,public_id.eq.supabase-test-application");

  console.log("Draft query result:", { data: draftApps, error: draftErr });
  if (draftApps && draftApps.length > 0) {
    console.error("SECURITY RISK: Anonymous user was able to retrieve draft application!", draftApps);
  } else {
    console.log("SUCCESS: Draft application is NOT exposed to anonymous users.");
  }

  console.log("\n=== Step 3: Query draft sections/questions directly (anonymous) ===");
  const { data: draftSecs, error: secErr } = await anonClient
    .from("sections")
    .select("id, title, application_id");
  
  console.log(`Direct sections query returned ${draftSecs?.length || 0} sections for anonymous user.`);
  const allBelongToPublished = (draftSecs || []).every(s => s.application_id === "52146dbb-ef8f-437d-ac11-3562c53b9378");
  console.log("All returned sections belong ONLY to published forms:", allBelongToPublished);

  console.log("\n=== Step 4: Verification Complete ===");
}

runTests();
