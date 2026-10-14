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

const anonClient = createClient(url, anonKey);

async function inspect() {
  console.log("Checking submissions table access...");
  const { data: subs, error: subsErr } = await anonClient
    .from("submissions")
    .select("*")
    .limit(1);
  console.log("Submissions SELECT result:", { count: subs?.length, error: subsErr });

  console.log("Checking answers table access...");
  const { data: ans, error: ansErr } = await anonClient
    .from("answers")
    .select("*")
    .limit(1);
  console.log("Answers SELECT result:", { count: ans?.length, error: ansErr });

  console.log("Checking files table access...");
  const { data: files, error: filesErr } = await anonClient
    .from("files")
    .select("*")
    .limit(1);
  console.log("Files SELECT result:", { count: files?.length, error: filesErr });
}

inspect();
