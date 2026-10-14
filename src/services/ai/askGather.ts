import { Application, AskGatherMessage, Section } from "../../types";
import { editApplication } from "./editApplication";
import { answerAskGather } from "./answerAskGather";
import { generateApplication } from "./generateApplication";
import { buildCreationSummary } from "../../utils/creationSummary";
import { IntentDetectionResponseSchema } from "./formSchema";
import {
  isGibberishText,
  isGreetingText,
  isOffTopicText,
  isAmbiguousText,
  isValidFormCreationPrompt,
  isValidFormEditInstruction,
} from "./intentValidation";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

export type AskGatherIntent =
  | "FORM_CREATE"
  | "FORM_EDIT"
  | "FORM_INFO"
  | "GENERAL"
  | "AMBIGUOUS"
  | "FORM_RELATED_CHAT"
  | "OUT_OF_SCOPE";

export interface AskGatherResult {
  type: "edit" | "create" | "form_info" | "general" | "ambiguous";
  updatedApp?: Application;
  message: string;
}

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

export async function detectIntent(
  userMessage: string,
  currentApp: Application,
  history: AskGatherMessage[] = []
): Promise<{ intent: AskGatherIntent; clarificationMessage?: string }> {
  const cleanMessage = userMessage.trim();
  const lower = cleanMessage.toLowerCase();

  // 1. FAST DETERMINISTIC GATES (Zero hallucination risk)
  if (isGibberishText(cleanMessage)) {
    return { intent: "GENERAL" };
  }

  if (isGreetingText(cleanMessage)) {
    return { intent: "GENERAL" };
  }

  if (isOffTopicText(cleanMessage)) {
    return { intent: "GENERAL" };
  }

  if (isAmbiguousText(cleanMessage)) {
    return { intent: "AMBIGUOUS" };
  }

  // Fast-path for common form info queries
  if (
    lower.startsWith("how many section") ||
    lower.startsWith("how many question") ||
    lower.includes("what questions are required") ||
    lower.includes("which questions are required") ||
    lower.includes("what fields are required") ||
    lower.includes("list the sections") ||
    lower.includes("list questions")
  ) {
    return { intent: "FORM_INFO" };
  }

  // Fast-path for verified form edit commands
  if (isValidFormEditInstruction(cleanMessage)) {
    return { intent: "FORM_EDIT" };
  }

  // 2. OPENROUTER STRUCTURED INTENT CLASSIFIER
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return { intent: "GENERAL" };
  }

  const systemPrompt = `You are Gather's strict intent classification engine for the form editor.
Your ONLY job is to categorize the user's message into one of five categories.

CATEGORIES:

1. "FORM_CREATE":
   User explicitly wants to create or build a completely new form from scratch with clear domain requirements.
   Examples:
   - "Create a volunteer application for a community event" -> FORM_CREATE
   - "Build a job application for a junior UX designer" -> FORM_CREATE
   - "I need a registration form for a conference" -> FORM_CREATE

2. "FORM_EDIT":
   User explicitly commands adding, removing, updating, reordering, or modifying questions/sections in the current form.
   Examples:
   - "Add a portfolio question" -> FORM_EDIT
   - "Remove date of birth" -> FORM_EDIT
   - "Make email required" -> FORM_EDIT
   - "Make these questions shorter" -> FORM_EDIT
   - "Change phone number to optional" -> FORM_EDIT
   - "Add a leadership section" -> FORM_EDIT

3. "FORM_INFO":
   User is asking a factual question about the current form without asking to modify it.
   Examples:
   - "How many sections does this form have?" -> FORM_INFO
   - "How many questions are in the form?" -> FORM_INFO
   - "What fields are currently required?" -> FORM_INFO
   - "What questions have you added?" -> FORM_INFO

4. "GENERAL":
   The message is meaningless, random gibberish ("sdf", "werwer", "asdfgh"), a greeting ("hello"), off-topic, jokes, trivia ("what is a dog", "tell me a joke", "what is ux design", "two line dog"), or not related to form building.
   Examples:
   - "werwer" -> GENERAL
   - "sdf" -> GENERAL
   - "asdfgh" -> GENERAL
   - "hello" -> GENERAL
   - "what is a dog" -> GENERAL
   - "tell me a joke" -> GENERAL
   - "Can you tell me about two line dog" -> GENERAL
   - "what is ux design" -> GENERAL

5. "AMBIGUOUS":
   The user wants a form change but provided an underspecified instruction without indicating what specifically should change.
   Examples:
   - "Make it better" -> AMBIGUOUS
   - "Change this" -> AMBIGUOUS
   - "Improve it" -> AMBIGUOUS
   - "Update the form" -> AMBIGUOUS

CRITICAL SAFETY RULE:
Never classify random words, gibberish, greetings, or off-topic questions as FORM_CREATE or FORM_EDIT.
If there is no concrete form operation or creation request, choose GENERAL or AMBIGUOUS.

Output ONLY valid JSON:
{
  "intent": "FORM_CREATE" | "FORM_EDIT" | "FORM_INFO" | "GENERAL" | "AMBIGUOUS",
  "confidence": 0.95,
  "reasoning": "brief explanation"
}
`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Include recent conversation context (last 4 messages)
  const recentHistory = history.slice(-4);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  messages.push({
    role: "user",
    content: `Current Form: "${currentApp.name}"\nUser Message: "${cleanMessage}"`,
  });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Gather Intent Classifier",
      },
      body: JSON.stringify({
        model,
        max_tokens: 256,
        temperature: 0,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!response.ok) {
      return { intent: "GENERAL" };
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) return { intent: "GENERAL" };

    const cleaned = cleanJsonResponse(rawText);
    const parsed = JSON.parse(cleaned);
    const validated = IntentDetectionResponseSchema.parse(parsed);

    let normalizedIntent: AskGatherIntent = validated.intent;
    if (normalizedIntent === "OUT_OF_SCOPE") normalizedIntent = "GENERAL";
    if (normalizedIntent === "FORM_RELATED_CHAT") normalizedIntent = "FORM_INFO";

    // 3. POST-CLASSIFICATION VALIDATION GATE
    if (normalizedIntent === "FORM_CREATE" && !isValidFormCreationPrompt(cleanMessage)) {
      normalizedIntent = "GENERAL";
    }

    if (normalizedIntent === "FORM_EDIT" && (isGibberishText(cleanMessage) || isOffTopicText(cleanMessage))) {
      normalizedIntent = "GENERAL";
    }

    return {
      intent: normalizedIntent,
      clarificationMessage: validated.clarificationMessage,
    };
  } catch (err) {
    console.warn("Intent detection fallback to GENERAL:", err);
    return { intent: "GENERAL" };
  }
}

export async function processAskGatherMessage(
  currentApp: Application,
  userMessage: string,
  history: AskGatherMessage[] = []
): Promise<AskGatherResult> {
  const cleanMessage = userMessage.trim();
  if (!cleanMessage) {
    return {
      type: "general",
      message: "Please enter an instruction or question regarding your form.",
    };
  }

  // 1. Classify Intent
  const { intent } = await detectIntent(cleanMessage, currentApp, history);

  const mutationAllowed = intent === "FORM_EDIT" || intent === "FORM_CREATE";
  console.log("[Ask Gather] User message:", cleanMessage);
  console.log("[Ask Gather] Intent:", intent);
  console.log("[Ask Gather] Mutation allowed:", mutationAllowed);

  // 2. Strict Intent Routing
  switch (intent) {
    case "FORM_EDIT": {
      try {
        const editResult = await editApplication(currentApp, cleanMessage, history);
        return {
          type: "edit",
          updatedApp: editResult.updatedApp,
          message: editResult.explanation,
        };
      } catch (err: any) {
        console.error("Form edit failed:", err);
        return {
          type: "general",
          message: err.message || "I couldn't process that edit safely. Could you describe what you'd like to change?",
        };
      }
    }

    case "FORM_CREATE": {
      // Gate: Form creation requires an actual valid creation prompt
      if (!isValidFormCreationPrompt(cleanMessage)) {
        const safeResponse = await answerAskGather(currentApp, cleanMessage, history, "GENERAL");
        return {
          type: "general",
          message: safeResponse,
        };
      }

      try {
        const generated = await generateApplication(cleanMessage);
        const updatedApp: Application = {
          ...currentApp,
          name: generated.name,
          description: generated.description,
          sections: generated.sections as Section[],
          lastUpdated: "just now",
        };

        const summary = buildCreationSummary(generated.name, generated.sections as Section[]);
        return {
          type: "create",
          updatedApp,
          message: summary,
        };
      } catch (err: any) {
        console.error("Form creation via Ask Gather failed:", err);
        return {
          type: "general",
          message: "Something went wrong while generating the application. Please try describing your form again.",
        };
      }
    }

    case "FORM_INFO":
    case "FORM_RELATED_CHAT": {
      // Read-only response from current form state. ZERO mutation.
      const answer = await answerAskGather(
        currentApp,
        cleanMessage,
        history,
        "FORM_INFO"
      );
      return {
        type: "form_info",
        message: answer,
      };
    }

    case "AMBIGUOUS": {
      // Ask for clarification. ZERO mutation.
      const clarification = await answerAskGather(
        currentApp,
        cleanMessage,
        history,
        "AMBIGUOUS"
      );
      return {
        type: "ambiguous",
        message: clarification,
      };
    }

    case "GENERAL":
    case "OUT_OF_SCOPE":
    default: {
      // Safe general scope response. ZERO mutation.
      const scopeResponse = await answerAskGather(
        currentApp,
        cleanMessage,
        history,
        "GENERAL"
      );
      return {
        type: "general",
        message: scopeResponse,
      };
    }
  }
}
