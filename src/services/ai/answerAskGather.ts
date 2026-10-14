import { Application, AskGatherMessage } from "../../types";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

function isGibberish(text: string): boolean {
  const clean = text.trim().toLowerCase();
  if (/^[bcdfghjklmnpqrstvwxyz]{2,15}$/i.test(clean)) return true;
  if (/^[a-z]{1,4}$/i.test(clean) && !["add", "edit", "help", "undo", "redo", "save", "name", "date", "mail", "form"].includes(clean)) return true;
  return false;
}

function isGreeting(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[!.,?]/g, "");
  const greetings = ["hi", "hello", "hey", "hola", "howdy", "sup", "greetings", "good morning", "good evening", "good afternoon"];
  return greetings.includes(clean);
}

export async function answerAskGather(
  currentApp: Application,
  userMessage: string,
  history: AskGatherMessage[] = [],
  mode: "FORM_INFO" | "FORM_RELATED_CHAT" | "OUT_OF_SCOPE" | "GENERAL" | "AMBIGUOUS" = "FORM_INFO"
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL;

  const totalQuestions = currentApp.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
  const totalSections = currentApp.sections.length;

  // 1. GENERAL / OUT_OF_SCOPE
  if (mode === "GENERAL" || mode === "OUT_OF_SCOPE") {
    if (isGibberish(userMessage)) {
      return `It seems like that isn't related to your form. I'm here to help you build and edit your Gather form — for example, adding or removing questions, changing question types, editing sections, or improving your questions.\n\nWhat would you like to change?`;
    }

    if (isGreeting(userMessage)) {
      return `Hi there! I'm here to help you build and edit your Gather form — things like adding or removing questions, configuring sections, adjusting fields, and improving wording.\n\nWhat would you like to change or add to your form?`;
    }

    // Unrelated / off-topic request
    const systemPrompt = `You are Gather's AI assistant, specifically built to help users create, build, configure, and edit Gather forms/applications.
The user asked something outside the scope of building or editing their form (e.g. general trivia, off-topic chat, poems, jokes, weather, etc.).

RULES:
1. DO NOT answer or entertain the unrelated topic or question.
2. Politely explain that you are an AI assistant specifically designed to help build and edit Gather forms (such as adding fields, configuring questions, adjusting sections, and improving their form).
3. Mention their topic politely if helpful (e.g. "It seems like your question about '${userMessage.replace(/["\n]/g, "").slice(0, 40)}' isn't related to editing your form...").
4. Redirect them back to what they would like to change or add to "${currentApp.name}".
5. Keep the response concise, polite, and professional (2–3 sentences).
`;

    if (apiKey) {
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
            max_tokens: 250,
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
        // Fall back below
      }
    }

    return `It seems like your question isn't related to editing your form. I'm an AI assistant specifically designed to help you build and edit your Gather form — things like adding fields, configuring questions, adjusting sections, and improving your form.\n\nIs there something you'd like to change or add to your form? I'm happy to help with that!`;
  }

  // 2. AMBIGUOUS
  if (mode === "AMBIGUOUS") {
    const lower = userMessage.trim().toLowerCase();
    if (lower.includes("better") || lower.includes("improve")) {
      return "Sure — what would you like to improve? I can help with question wording, structure, sections, required fields, or answer types.";
    }
    if (lower.includes("change")) {
      return "What would you like me to change? I can help add, remove, or modify questions and sections.";
    }
    return "Sure — what specifically would you like to change or add to your form? I can help modify questions, sections, answer types, and requirements.";
  }

  // 3. FORM_INFO / FORM_RELATED_CHAT (Read-only, answers from current form)
  const lowerMsg = userMessage.trim().toLowerCase();

  // Fast deterministic answers for common info queries
  if (lowerMsg.includes("how many section") || lowerMsg.includes("number of section")) {
    return `Your form currently has ${totalSections} section${totalSections === 1 ? "" : "s"} with ${totalQuestions} question${totalQuestions === 1 ? "" : "s"}.`;
  }

  if (lowerMsg.includes("how many question") || lowerMsg.includes("number of question")) {
    return `Your form currently has ${totalQuestions} question${totalQuestions === 1 ? "" : "s"} across ${totalSections} section${totalSections === 1 ? "" : "s"}.`;
  }

  if (lowerMsg.includes("what questions are required") || lowerMsg.includes("which questions are required") || lowerMsg.includes("what fields are required")) {
    const requiredQuestions: string[] = [];
    currentApp.sections.forEach((s) => {
      s.questions.forEach((q) => {
        if (q.required) requiredQuestions.push(`"${q.label}" (in ${s.title})`);
      });
    });

    if (requiredQuestions.length === 0) {
      return "There are currently no required questions in your form.";
    }
    return `The following question${requiredQuestions.length === 1 ? " is" : "s are"} currently required:\n• ${requiredQuestions.join("\n• ")}`;
  }

  // General LLM-powered form info answer
  const sectionsSummary = currentApp.sections.map((s) => ({
    title: s.title,
    questions: s.questions.map((q) => `${q.label} (type: ${q.type}, required: ${q.required})`),
  }));

  const systemPrompt = `You are Gather's helpful AI form assistant inside the form builder application editor.
The user is asking a factual or explanatory question specifically about their current form state or form design.

CURRENT FORM STATE:
- Form Title: "${currentApp.name}"
- Form Description: "${currentApp.description}"
- Sections & Questions: ${JSON.stringify(sectionsSummary, null, 2)}
- Total Sections: ${totalSections}
- Total Questions: ${totalQuestions}

GUIDELINES:
1. Answer the user's question accurately and helpfully based strictly on the current form state above.
2. DO NOT output JSON. Output natural conversational text.
3. You are NOT modifying the form right now. Do not pretend to make changes.
4. Keep the answer concise and direct (1–3 sentences).
`;

  if (apiKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Gather Form Info",
        },
        body: JSON.stringify({
          model,
          max_tokens: 500,
          messages: [
            { role: "system", content: systemPrompt },
            ...history.slice(-4).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
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
      // Fallback
    }
  }

  return `Your form "${currentApp.name}" currently has ${totalSections} sections and ${totalQuestions} questions. What would you like to know or edit?`;
}
