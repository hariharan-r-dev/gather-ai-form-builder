import fs from "fs";

async function main() {
  const envText = fs.readFileSync(".env", "utf-8");
  const env = {};
  for (const line of envText.split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && v.length) env[k.trim()] = v.join("=").trim();
  }

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const storagePath = "uploads/test_progress_" + Date.now() + ".txt";

  const fileContent = "This is a test file for XHR upload progress.";
  const res = await fetch(`${supabaseUrl}/storage/v1/object/submission-files/${storagePath}`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "text/plain",
      "x-upsert": "true",
    },
    body: fileContent,
  });

  const resJson = await res.json();
  console.log("Upload status:", res.status, "Response:", resJson);
}

main().catch(console.error);
