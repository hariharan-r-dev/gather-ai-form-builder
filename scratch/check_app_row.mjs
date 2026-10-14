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

async function checkApp() {
  const { data, error } = await anonClient
    .from("applications")
    .select("id, name, status, is_public, slug")
    .eq("id", "52146dbb-ef8f-437d-ac11-3562c53b9378");

  console.log("App check:", { data, error });
}

checkApp();
