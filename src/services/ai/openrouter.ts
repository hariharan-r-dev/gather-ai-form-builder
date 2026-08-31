import { AIProvider } from "./aiProvider";

// TODO: In a production environment, this completion API request must be moved
// behind a secure backend/serverless endpoint to protect the VITE_OPENROUTER_API_KEY from exposure in the client browser.

const DEFAULT_MODEL = "google/gemini-2.5-flash";

export const OpenRouterAIProvider: AIProvider = {
  name: "OpenRouter",
  generateApplication: async (prompt: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL;

    if (!apiKey) {
      throw new Error(
        "OpenRouter API key is missing. Please configure VITE_OPENROUTER_API_KEY in your environment variables."
      );
    }

    const systemPrompt = `You are Gather's structured form generator.
Your job is to convert natural-language requirements into a complete, logical application schema.
You MUST output ONLY a valid JSON object matching the following structure. Do not include markdown code block syntax (like \`\`\`json), do not include any conversational text.

JSON Schema structure:
{
  "name": "Title of the application, concise and descriptive",
  "description": "Short explanation of what this application is for",
  "sections": [
    {
      "title": "Section Title (e.g. Personal Information, Experience, Background, etc.)",
      "questions": [
        {
          "label": "Question text/label, concise and clear",
          "type": "short_answer",
          "required": true,
          "placeholder": "Optional helper placeholder value",
          "options": ["Option 1", "Option 2"] (Only for single_choice, multiple_choice, dropdown),
          "hasOther": true | false (Only for single_choice, multiple_choice, dropdown)
        }
      ]
    }
  ]
}

Rules:
- Understand the user's specific intent. Do not default to a job application unless requested.
- Organize questions into logical sections.
- Keep questions clean, clear, and relevant. Do not add redundant or excessive fields.
- Make "required" true only when absolutely necessary (e.g. name, email).
- Supported types: short_answer, long_answer, email, phone, number, url, single_choice, multiple_choice, dropdown, date, file, checkbox. Do not use any other types.
`;

    try {
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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Create a form based on this description: ${prompt}` },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText || response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error("Empty response received from OpenRouter completion API.");
      }

      return text;
    } catch (err: any) {
      console.error("OpenRouter service error:", err);
      throw new Error(err.message || "Failed to contact OpenRouter API.");
    }
  },
};
