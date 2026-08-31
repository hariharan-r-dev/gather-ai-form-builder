import { Application, AskGatherMessage, Question, Section } from "../../types";
import { ApplicationDraftSchema, EditApplicationResponseSchema } from "./formSchema";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].startsWith("```json") || lines[0] === "```") {
      lines.shift();
    }
    if (lines[lines.length - 1] === "```") {
      lines.pop();
    }
    cleaned = lines.join("\n").trim();
  }
  return cleaned;
}

function normalizeQuestionType(type: string): string {
  const t = type.toLowerCase().trim().replace(/[\s_-]+/g, "");
  switch (t) {
    case "text":
    case "short":
    case "shortanswer":
    case "singleline":
      return "short_answer";
    case "long":
    case "longanswer":
    case "paragraph":
    case "textarea":
    case "multiline":
      return "long_answer";
    case "email":
    case "emailaddress":
      return "email";
    case "phone":
    case "phonenumber":
    case "tel":
      return "phone";
    case "number":
    case "integer":
    case "float":
    case "numeric":
      return "number";
    case "url":
    case "website":
    case "link":
      return "url";
    case "radio":
    case "singlechoice":
    case "choice":
    case "option":
      return "single_choice";
    case "checkboxes":
    case "multiplechoice":
    case "multichoice":
      return "multiple_choice";
    case "select":
    case "dropdown":
    case "list":
      return "dropdown";
    case "date":
    case "datetime":
    case "calendar":
      return "date";
    case "file":
    case "upload":
    case "fileupload":
    case "attachment":
      return "file";
    case "checkbox":
    case "boolean":
    case "toggle":
      return "checkbox";
    default:
      return "short_answer";
  }
}

export interface EditApplicationResult {
  updatedApp: Application;
  explanation: string;
}

export async function editApplication(
  currentApp: Application,
  instruction: string,
  history: AskGatherMessage[] = []
): Promise<EditApplicationResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error(
      "OpenRouter API key is missing. Please configure VITE_OPENROUTER_API_KEY in your environment variables."
    );
  }

  const systemPrompt = `You are Gather's AI application editing assistant.
Your job is to update an existing application form based on the user's instructions.

CRITICAL RULES:
1. You must return a JSON object with two fields:
   - "explanation": A concise 1-sentence confirmation of what was changed (e.g. "Added a portfolio URL question under Personal Information." or "Changed years of experience to a dropdown.").
   - "application": The complete, updated application object matching the schema below.
2. PRESERVE UNCHANGED CONTENT: Keep all existing questions, sections, IDs, options, placeholders, and required settings intact unless the user explicitly asked to modify, remove, reorder, or replace them.
3. PRESERVE IDs: Keep the existing "id" for each section and question that remains in the form. If you add a new question or section, you may omit "id" or provide a new unique string.
4. TYPE INTEGRITY: Supported question types are: short_answer, long_answer, email, phone, number, url, single_choice, multiple_choice, dropdown, date, file, checkbox.
5. ONLY JSON: Output ONLY the valid JSON object. Do not include markdown code block syntax (like \`\`\`json), do not include any conversational text outside the JSON.

Expected JSON output format:
{
  "explanation": "Short confirmation message describing the change",
  "application": {
    "name": "Application Name",
    "description": "Application Description",
    "sections": [
      {
        "id": "existing-section-id",
        "title": "Section Title",
        "questions": [
          {
            "id": "existing-question-id",
            "label": "Question label",
            "type": "short_answer",
            "required": true,
            "placeholder": "Optional helper text",
            "options": ["Option 1", "Option 2"],
            "hasOther": false
          }
        ]
      }
    ]
  }
}
`;

  // Build clean representation of the current application
  const currentAppSnapshot = {
    name: currentApp.name,
    description: currentApp.description,
    sections: currentApp.sections.map((s) => ({
      id: s.id,
      title: s.title,
      questions: s.questions.map((q) => ({
        id: q.id,
        label: q.label,
        type: q.type,
        required: q.required,
        placeholder: q.placeholder || "",
        options: q.options || [],
        hasOther: q.hasOther || false,
      })),
    })),
  };

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Include recent conversation context (last 6 messages)
  const recentHistory = history.slice(-6);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  // User edit command with authoritative current application snapshot
  const userContent = `Original Creation Request: "${currentApp.creationPrompt || "N/A"}"

Current Application Structure:
${JSON.stringify(currentAppSnapshot, null, 2)}

User Instruction: "${instruction}"
`;

  messages.push({ role: "user", content: userContent });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Gather MVP Builder",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText || response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error("Empty response received from OpenRouter editing API.");
  }

  const cleaned = cleanJsonResponse(rawText);
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("The AI generated edit could not be parsed as valid JSON. Please try again.");
  }

  let explanation = "Updated your application.";
  let appData: any = parsed;

  // Handle both wrapped format { explanation, application } and direct application format
  if (parsed.application) {
    const validatedEdit = EditApplicationResponseSchema.parse(parsed);
    explanation = validatedEdit.explanation || explanation;
    appData = validatedEdit.application;
  } else {
    appData = ApplicationDraftSchema.parse(parsed);
  }

  // Map and normalize updated sections/questions while preserving IDs where available
  const existingSectionMap = new Map<string, Section>(currentApp.sections.map((s) => [s.id, s]));
  const existingQuestionMap = new Map<string, Question>();
  for (const s of currentApp.sections) {
    for (const q of s.questions) {
      existingQuestionMap.set(q.id, q);
    }
  }

  const normalizedSections: Section[] = appData.sections.map((sec: any, sIdx: number) => {
    const sectionId = sec.id && existingSectionMap.has(sec.id) ? sec.id : sec.id || `s-${Date.now()}-${sIdx}`;
    return {
      id: sectionId,
      title: sec.title.trim(),
      questions: sec.questions.map((q: any, qIdx: number) => {
        const questionId = q.id && existingQuestionMap.has(q.id) ? q.id : q.id || `q-${Date.now()}-${sIdx}-${qIdx}`;
        return {
          id: questionId,
          label: q.label.trim(),
          type: normalizeQuestionType(q.type),
          required: !!q.required,
          placeholder: q.placeholder?.trim() || "",
          options: q.options && q.options.length > 0 ? q.options : undefined,
          hasOther: q.hasOther !== undefined ? !!q.hasOther : undefined,
        };
      }),
    };
  });

  const updatedApp: Application = {
    ...currentApp,
    name: appData.name?.trim() || currentApp.name,
    description: appData.description?.trim() || currentApp.description,
    sections: normalizedSections,
    lastUpdated: "just now",
  };

  return {
    updatedApp,
    explanation,
  };
}
