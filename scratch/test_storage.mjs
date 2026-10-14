import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = "https://coqkkheuittnjsvtymno.supabase.co";
const supabaseKey = "sb_publishable_HzwRtt2cCkvcK-wONpM2OQ_pdJMFFAy";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  const testBlob = Buffer.from("Hello Gather Test Storage Content 12345");
  const testPath = `uploads/test-${Date.now()}.txt`;

  console.log("Uploading test file to submission-files...");
  const { data, error } = await supabase.storage.from("submission-files").upload(testPath, testBlob, {
    contentType: "text/plain",
    upsert: true,
  });

  if (error) {
    console.error("Storage upload error:", error);
  } else {
    console.log("Upload successful:", data);
    const { data: dl, error: dlErr } = await supabase.storage.from("submission-files").download(testPath);
    console.log("Download check:", dl ? "Success" : "Failed", dlErr);
    await supabase.storage.from("submission-files").remove([testPath]);
    console.log("Cleaned up test file.");
  }
}

testStorage();
