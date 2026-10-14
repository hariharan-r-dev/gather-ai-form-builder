import { supabase } from "../src/lib/supabase";

async function testAnonymousFullTree() {
  console.log("=== Testing Anonymous Full Tree Query for 'junior-ux-designer-application' ===");

  // Ensure anonymous client (no signed in user)
  await supabase.auth.signOut();

  const target = "junior-ux-designer-application";
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(target);

  let query = supabase
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

  if (isUuid) {
    query = query.or(`slug.eq.${target},public_id.eq.${target},id.eq.${target}`);
  } else {
    query = query.or(`slug.eq.${target},public_id.eq.${target}`);
  }

  const { data, error } = await query;

  console.log("Query Error:", error);
  console.log("Data count:", data?.length);
  if (data && data.length > 0) {
    console.log("Application details:", {
      id: data[0].id,
      name: data[0].name,
      slug: data[0].slug,
      status: data[0].status,
      is_public: data[0].is_public,
      sections_count: data[0].sections?.length,
      questions_count: data[0].sections?.[0]?.questions?.length,
      options_count: data[0].sections?.[0]?.questions?.[0]?.question_options?.length,
    });
    console.log("Full tree JSON:", JSON.stringify(data[0], null, 2));
  }
}

testAnonymousFullTree();
