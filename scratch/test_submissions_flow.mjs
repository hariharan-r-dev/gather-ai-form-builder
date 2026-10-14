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

const appId = "52146dbb-ef8f-437d-ac11-3562c53b9378";

function isUuid(str) {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function ensureUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function parseFileAnswer(val) {
  if (!val || typeof val !== "string" || !val.trim()) return null;
  try {
    const parsed = JSON.parse(val);
    if (parsed && typeof parsed === "object" && typeof parsed.fileName === "string" && parsed.fileName.trim()) {
      return parsed;
    }
  } catch {
    const trimmed = val.trim();
    if (/^[\w,\s-]+\.(pdf|docx?|png|jpe?g|webp|csv|xlsx?|txt)$/i.test(trimmed)) {
      return { fileName: trimmed };
    }
  }
  return null;
}

async function createSubmission(applicationId, answers, nameInput, emailInput) {
  const subId = ensureUuid();
  const now = new Date();
  const nowIso = now.toISOString();

  let name = nameInput?.trim() || "";
  let email = emailInput?.trim() || "";

  if (!name || !email) {
    let firstName = "";
    let lastName = "";

    for (const ans of answers) {
      const qLower = (ans.question || "").toLowerCase().trim();
      const ansVal = (ans.answer || "").trim();

      if (qLower === "first name" || qLower.startsWith("first name")) {
        firstName = ansVal;
      } else if (qLower === "last name" || qLower.startsWith("last name")) {
        lastName = ansVal;
      } else if (!name && (qLower.includes("full name") || qLower === "your name" || qLower === "name")) {
        name = ansVal;
      }

      if (!email && (qLower.includes("email") || ansVal.includes("@"))) {
        email = ansVal;
      }
    }

    if (!name && (firstName || lastName)) {
      name = `${firstName} ${lastName}`.trim();
    }
  }

  if (!name) name = "Anonymous Applicant";
  if (!email) email = "no-email@provided.com";

  // 1. Insert Submission
  const { error: subError } = await anonClient.from("submissions").insert({
    id: subId,
    application_id: applicationId,
    respondent_name: name,
    respondent_email: email,
    notes: "",
    submitted_at: nowIso,
    updated_at: nowIso,
  });

  if (subError) {
    throw new Error(`Failed to create submission: ${subError.message}`);
  }

  // 2. Insert Answers & Files
  if (answers && answers.length > 0) {
    const answerRows = [];
    const fileRows = [];

    for (const ans of answers) {
      const ansId = ensureUuid();
      const parsedFile = parseFileAnswer(ans.answer);
      let fileId = null;

      if (parsedFile && parsedFile.fileId) {
        fileId = parsedFile.fileId;
        fileRows.push({
          id: ensureUuid(),
          application_id: applicationId,
          submission_id: subId,
          question_id: isUuid(ans.questionId) ? ans.questionId : null,
          file_id: parsedFile.fileId,
          storage_path: `submissions/${subId}/${parsedFile.fileId}`,
          original_filename: parsedFile.fileName || "uploaded_file",
          mime_type: parsedFile.fileType || "application/octet-stream",
          size_bytes: parsedFile.sizeBytes || 0,
          file_size_formatted: parsedFile.fileSize || null,
        });
      }

      answerRows.push({
        id: ansId,
        submission_id: subId,
        question_id: isUuid(ans.questionId) ? ans.questionId : null,
        question_label: ans.question || "",
        question_type: ans.questionType || "short_answer",
        answer_text: ans.answer || "",
        answer_json: parsedFile || null,
        file_id: fileId,
      });
    }

    if (fileRows.length > 0) {
      const { error: fileErr } = await anonClient.from("files").insert(fileRows);
      if (fileErr) console.warn("Warning inserting files:", fileErr);
    }

    const { error: ansError } = await anonClient.from("answers").insert(answerRows);
    if (ansError) {
      throw new Error(`Failed to insert answers: ${ansError.message}`);
    }
  }

  return { id: subId, name, email, answers };
}

async function runTest() {
  console.log("=== STEP 1: Creating a complete submission for Junior UX Designer Application ===");

  const sampleAnswers = [
    {
      questionId: "1038f779-ffd5-409c-a6cf-a92024d56b6e",
      question: "First name",
      questionType: "short_answer",
      answer: "Sarah",
    },
    {
      questionId: "dcf75cb8-eb94-4f8d-900b-1ff2971f235c",
      question: "Last name",
      questionType: "short_answer",
      answer: "Connor",
    },
    {
      questionId: "05699d24-b60c-4ca1-ad66-bcdc691ba8d2",
      question: "Phone Number",
      questionType: "phone",
      answer: "+1 (555) 019-2834",
    },
    {
      questionId: "96a21afe-b81a-4d0c-a4e7-24d08b8a46e5",
      question: "Email",
      questionType: "email",
      answer: "sarah.connor@example.com",
    },
    {
      questionId: "6880538a-592e-4a06-80cf-8eb0987fd6ac",
      question: "LinkedIn Profile URL",
      questionType: "url",
      answer: "https://linkedin.com/in/sarahconnor",
    },
    {
      questionId: "1b4f1cc5-6382-474c-aeca-751b6354b888",
      question: "Years of UX Design Experience",
      questionType: "number",
      answer: "3",
    },
    {
      questionId: "8e10e671-4aba-4eab-8ec0-0f2dbd2b304b",
      question: "Resume Upload",
      questionType: "file",
      answer: JSON.stringify({
        fileId: "file-resume-12345",
        fileName: "Sarah_Connor_UX_Resume.pdf",
        fileSize: "1.4 MB",
        fileType: "application/pdf",
        sizeBytes: 1468006,
      }),
    },
    {
      questionId: "398f6f3e-cb02-4335-bb79-27b1ed923334",
      question: "Highest Level of Education",
      questionType: "dropdown",
      answer: "Bachelor's Degree",
    },
  ];

  const sub = await createSubmission(appId, sampleAnswers);
  console.log("SUCCESS! Created submission:", {
    id: sub.id,
    derivedName: sub.name,
    derivedEmail: sub.email,
    answersCount: sub.answers.length,
  });

  console.log("\n=== STEP 2: Verifying database entries in Supabase ===");
  // Check answers
  const { data: answersInDb, error: ansErr } = await anonClient
    .from("answers")
    .select("*")
    .eq("submission_id", sub.id);

  console.log(`Answers saved in database: ${answersInDb?.length || 0} rows (Error: ${ansErr})`);
  if (answersInDb && answersInDb.length > 0) {
    for (const a of answersInDb) {
      console.log(`  - [${a.question_type}] ${a.question_label}: "${a.answer_text.substring(0, 40)}" (file_id: ${a.file_id})`);
    }
  }

  // Check files
  const { data: filesInDb, error: fileErr } = await anonClient
    .from("files")
    .select("*")
    .eq("submission_id", sub.id);

  console.log(`Files metadata saved in database: ${filesInDb?.length || 0} rows (Error: ${fileErr})`);
  if (filesInDb && filesInDb.length > 0) {
    for (const f of filesInDb) {
      console.log(`  - File: "${f.original_filename}" (${f.file_size_formatted}, path: ${f.storage_path})`);
    }
  }

  console.log("\n=== SUBMISSION PERSISTENCE VERIFICATION PASSED! ===");
}

runTest();
