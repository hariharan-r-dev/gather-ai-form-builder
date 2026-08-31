import { Application, AskGatherMessage } from "../../types";
import { editApplication } from "./editApplication";
import { answerAskGather } from "./answerAskGather";
import { IntentDetectionResponseSchema } from "./formSchema";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

export type AskGatherIntent =
  | "FORM_EDIT"
  | "FORM_RELATED_CHAT"
  | "OUT_OF_SCOPE"
  | "AMBIGUOUS";

export interface AskGatherResult {
  type: "edit" | "form_chat" | "out_of_scope" | "ambiguous";
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
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error(
      "OpenRouter API key is missing. Please configure VITE_OPENROUTER_API_KEY in your environment variables."
    );
  }

  // Pre-check for known quick suggestion triggers (always FORM_EDIT)
  const knownSuggestions = [
    "Add a portfolio question",
    "Make these questions shorter",
    "Add a leadership question",
    "Make this suitable for students",
    "Improve these questions",
  ];
  if (knownSuggestions.includes(userMessage.trim())) {
    return { intent: "FORM_EDIT" };
  }

  const systemPrompt = `You are Gather's intent classification engine for the form editor.
Your job is to determine what the user is trying to do with strict precision.

CLASSIFY INTO EXACTLY ONE OF THESE FOUR CATEGORIES:

1. "FORM_EDIT":
   The user explicitly wants to create, change, remove, reorder, or configure something in the current form.
   Strong edit actions: add, remove, delete, change, make required, make optional, shorten, add options, rename section, convert to dropdown, etc.
   Examples:
   - "Add a portfolio question." -> FORM_EDIT
   - "Remove date of birth." -> FORM_EDIT
   - "Make email optional." -> FORM_EDIT
   - "Change experience to a dropdown." -> FORM_EDIT
   - "Add a section called Motivation." -> FORM_EDIT
   - "Make these questions shorter." -> FORM_EDIT
   - "Add options: Beginner, Intermediate, Advanced." -> FORM_EDIT
   - "Move this question to Background." -> FORM_EDIT
   - "Make that question optional." (referring to a previous edit in history) -> FORM_EDIT

2. "FORM_RELATED_CHAT":
   The user is asking a question or seeking explanation/feedback ABOUT the current form, form design, questions, or choices, but is NOT asking to mutate the form.
   Examples:
   - "What questions are currently in this form?" -> FORM_RELATED_CHAT
   - "Why did you add this question?" -> FORM_RELATED_CHAT
   - "Why is this question required?" -> FORM_RELATED_CHAT
   - "How many questions are in the form?" -> FORM_RELATED_CHAT
   - "Is this form suitable for a job application?" -> FORM_RELATED_CHAT
   - "What kind of questions should a volunteer application have?" -> FORM_RELATED_CHAT

3. "OUT_OF_SCOPE":
   The user's message is unrelated to creating, building, configuring, or understanding their Gather form (e.g. general trivia, off-topic chat, poems, jokes, weather, unrelated subjects).
   Examples:
   - "Can you tell me about two line dog?" -> OUT_OF_SCOPE
   - "What is the weather today?" -> OUT_OF_SCOPE
   - "Write me a poem." -> OUT_OF_SCOPE
   - "Who is Elon Musk?" -> OUT_OF_SCOPE
   - "Tell me a joke." -> OUT_OF_SCOPE
   - "Help me calculate my taxes." -> OUT_OF_SCOPE
   - "What's the capital of France?" -> OUT_OF_SCOPE

4. "AMBIGUOUS":
   The user wants a form change but gave a vague, underspecified instruction without indicating what specifically should change.
   Examples:
   - "Fix it." -> AMBIGUOUS
   - "Make it better." -> AMBIGUOUS
   - "Change this." -> AMBIGUOUS
   - "Improve it." -> AMBIGUOUS
   - "Update the form." -> AMBIGUOUS

CRITICAL SAFETY RULE:
Only choose "FORM_EDIT" if the user explicitly commanded an action on form fields/sections.
If uncertain or if the request is off-topic, choose "OUT_OF_SCOPE" or "AMBIGUOUS". NEVER default to "FORM_EDIT".

Return ONLY valid JSON:
{
  "intent": "FORM_EDIT" | "FORM_RELATED_CHAT" | "OUT_OF_SCOPE" | "AMBIGUOUS",
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
    content: `Current Form: "${currentApp.name}"\nUser Message: "${userMessage}"`,
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
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!response.ok) {
      return { intent: "OUT_OF_SCOPE" };
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) return { intent: "OUT_OF_SCOPE" };

    const cleaned = cleanJsonResponse(rawText);
    const parsed = JSON.parse(cleaned);
    const validated = IntentDetectionResponseSchema.parse(parsed);

    return {
      intent: validated.intent,
      clarificationMessage: validated.clarificationMessage,
    };
  } catch (err) {
    console.warn("Intent detection fallback to OUT_OF_SCOPE:", err);
    return { intent: "OUT_OF_SCOPE" };
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
      type: "out_of_scope",
      message: "Please enter an instruction or question regarding your form.",
    };
  }

  // 1. Classify Intent
  const { intent } = await detectIntent(cleanMessage, currentApp, history);

  // 2. Route based strictly on intent
  if (intent === "FORM_EDIT") {
    // FORM_EDIT: Allowed to mutate application
    const editResult = await editApplication(currentApp, cleanMessage, history);
    return {
      type: "edit",
      updatedApp: editResult.updatedApp,
      message: editResult.explanation,
    };
  }

  if (intent === "FORM_RELATED_CHAT") {
    // FORM_RELATED_CHAT: Answer in form context, NO mutation
    const answer = await answerAskGather(
      currentApp,
      cleanMessage,
      history,
      "FORM_RELATED_CHAT"
    );
    return {
      type: "form_chat",
      message: answer,
    };
  }

  if (intent === "OUT_OF_SCOPE") {
    // OUT_OF_SCOPE: Explain Ask Gather's form-building purpose and redirect, NO mutation
    const scopeResponse = await answerAskGather(
      currentApp,
      cleanMessage,
      history,
      "OUT_OF_SCOPE"
    );
    return {
      type: "out_of_scope",
      message: scopeResponse,
    };
  }

  // intent === "AMBIGUOUS": Ask for clarification, NO mutation
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
