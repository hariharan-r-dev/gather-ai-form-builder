import { Application, AskGatherMessage } from "../../types";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

export async function answerAskGather(
  currentApp: Application,
  userMessage: string,
  history: AskGatherMessage[] = [],
  mode: "FORM_RELATED_CHAT" | "OUT_OF_SCOPE" | "AMBIGUOUS" = "FORM_RELATED_CHAT"
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error(
      "OpenRouter API key is missing. Please configure VITE_OPENROUTER_API_KEY in your environment variables."
    );
  }

  if (mode === "OUT_OF_SCOPE") {
    // Generate a contextual scope-aware redirection response
    const systemPrompt = `You are Gather's AI assistant, specifically built to help users create, build, configure, and edit Gather forms/applications.
The user asked something outside the scope of building or editing their form (e.g. general trivia, unrelated chat, weather, programming, etc.).

RULES:
1. DO NOT answer or entertain the unrelated topic or question.
2. Politely explain that your sole role is to assist with creating and editing their Gather form (such as adding questions, configuring sections, adjusting fields, or improving wording).
3. Mention their topic politely (e.g. "It seems like your question about '${userMessage.replace(/["\n]/g, "").slice(0, 50)}' isn't related to editing your form...").
4. Redirect them back to what they would like to change or add to their current form "${currentApp.name}".
5. Keep the response concise, polite, and professional (2–3 sentences).
`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Gather Scope Enforcement",
        },
        body: JSON.stringify({
          model,
          max_tokens: 300,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.choices?.[0]?.message?.content?.trim();
        if (rawText) return rawText;
      }
    } catch {
      // Fallback response if API fails
    }

    return `It seems like your question isn't related to editing your form. I'm an AI assistant specifically designed to help you build and edit your Gather form — things like adding questions, configuring sections, adjusting fields, and improving your form.\n\nIs there something you'd like to change or add to "${currentApp.name}"? I'm happy to help with that!`;
  }

  if (mode === "AMBIGUOUS") {
    return "Sure — what would you like me to improve: the questions, sections, field types, or overall wording?";
  }

  // mode === "FORM_RELATED_CHAT"
  const sectionsSummary = currentApp.sections.map((s) => ({
    title: s.title,
    questions: s.questions.map((q) => `${q.label} (${q.type}${q.required ? ", required" : ""})`),
  }));

  const systemPrompt = `You are Gather's helpful AI form assistant inside the form builder application editor.
The user is asking a question specifically about their current form/application or form creation practices (e.g. asking what questions are present, why a question was added, whether it fits their audience, etc.).

CURRENT FORM CONTEXT:
- Form Title: "${currentApp.name}"
- Form Description: "${currentApp.description}"
- Original Creation Request: "${currentApp.creationPrompt || "N/A"}"
- Current Sections & Questions: ${JSON.stringify(sectionsSummary, null, 2)}

GUIDELINES:
1. Answer the user's form-related question helpfully, accurately, and concisely (1–3 sentences).
2. DO NOT output JSON. Output natural conversational plain text.
3. You are NOT modifying the form right now; you are explaining or answering questions about it.
4. If asked why a question was included or required, explain the rationale based on their original request and standard form best practices.
`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Include recent history (last 4 messages)
  const recentHistory = history.slice(-4);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  messages.push({ role: "user", content: userMessage });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Gather Form Chat",
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText || response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content?.trim();
  if (!rawText) {
    return "I'm here to help with your application. What would you like to know about your form?";
  }

  return rawText;
}
