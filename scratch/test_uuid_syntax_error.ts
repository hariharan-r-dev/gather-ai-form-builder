import { supabase } from "../src/lib/supabase";

async function testQuery() {
  const target = "junior-ux-designer-application";
  console.log("=== Testing query with .or() containing id.eq ===");

  const res1 = await supabase
    .from("applications")
    .select("id, name, slug")
    .or(`slug.eq.${target},public_id.eq.${target},id.eq.${target}`);

  console.log("Result 1 Error:", res1.error);
  console.log("Result 1 Data:", res1.data);

  console.log("\n=== Testing query with clean UUID check ===");
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(target);
  let query = supabase.from("applications").select("id, name, slug");
  if (isUuid) {
    query = query.or(`slug.eq.${target},public_id.eq.${target},id.eq.${target}`);
  } else {
    query = query.or(`slug.eq.${target},public_id.eq.${target}`);
  }

  const res2 = await query;
  console.log("Result 2 Error:", res2.error);
  console.log("Result 2 Data:", res2.data);
}

testQuery();
