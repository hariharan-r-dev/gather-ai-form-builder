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
const client = createClient(url, anonKey);

async function testStorage() {
  console.log("=== Testing Supabase Storage Buckets ===");
  const { data: buckets, error: bErr } = await client.storage.listBuckets();
  console.log("Buckets:", buckets, "Error:", bErr);

  // Test uploading a small sample file to submission-files
  const testBlob = Buffer.from("%PDF-1.4 sample pdf content test", "utf-8");
  const testPath = `test-folder/test-${Date.now()}.pdf`;

  console.log("Testing upload to submission-files...");
  const { data: uploadData, error: upErr } = await client.storage
    .from("submission-files")
    .upload(testPath, testBlob, {
      contentType: "application/pdf",
      upsert: true,
    });

  console.log("Upload result:", { uploadData, upErr });

  if (!upErr) {
    console.log("Testing createSignedUrl...");
    const { data: signedData, error: signErr } = await client.storage
      .from("submission-files")
      .createSignedUrl(testPath, 3600);
    console.log("Signed URL result:", { signedData, signErr });

    console.log("Testing download...");
    const { data: dlData, error: dlErr } = await client.storage
      .from("submission-files")
      .download(testPath);
    console.log("Download result:", { dlDataSize: dlData?.size, dlErr });
  }
}

testStorage();
