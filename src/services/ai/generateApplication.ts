import { OpenRouterAIProvider } from "./openrouter";
import { ApplicationDraftSchema, GeneratedApplicationDraft } from "./formSchema";

// Currently defaults to OpenRouter, but can be switched to another provider easily
const activeProvider = OpenRouterAIProvider;

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  // Strip Markdown code blocks if present
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

export async function generateApplication(prompt: string): Promise<GeneratedApplicationDraft> {
  const rawText = await activeProvider.generateApplication(prompt);
  const cleaned = cleanJsonResponse(rawText);

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      "The AI generated response could not be parsed as valid JSON. Please try again."
    );
  }

  // Schema Validation
  const validated = ApplicationDraftSchema.parse(parsed);

  // Normalization Step
  const normalizedSections = validated.sections.map((sec, sIdx) => ({
    id: sec.id || `s-${Date.now()}-${sIdx}`,
    title: sec.title.trim(),
    questions: sec.questions.map((q, qIdx) => ({
      id: q.id || `q-${Date.now()}-${sIdx}-${qIdx}`,
      label: q.label.trim(),
      type: normalizeQuestionType(q.type),
      required: !!q.required,
      placeholder: q.placeholder?.trim() || "",
      options: q.options || undefined,
      hasOther: q.hasOther !== undefined ? !!q.hasOther : undefined,
    })),
  }));

  return {
    name: validated.name.trim(),
    description: validated.description.trim(),
    sections: normalizedSections,
  };
}
