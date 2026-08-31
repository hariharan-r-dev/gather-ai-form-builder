import { z } from "zod";

export const QuestionTypeSchema = z.enum([
  "short_answer",
  "long_answer",
  "email",
  "phone",
  "number",
  "url",
  "single_choice",
  "multiple_choice",
  "dropdown",
  "date",
  "file",
  "checkbox",
]);

export const QuestionSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Question label cannot be empty"),
  type: QuestionTypeSchema,
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string().min(1)).optional(),
  hasOther: z.boolean().optional(),
}).refine((data) => {
  const isChoiceType = ["single_choice", "multiple_choice", "dropdown"].includes(data.type);
  if (isChoiceType) {
    return data.options && data.options.length > 0;
  }
  return true;
}, {
  message: "Choice questions (Single choice, Multiple choice, Dropdown) must have options defined",
  path: ["options"],
});

export const SectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Section title cannot be empty"),
  questions: z.array(QuestionSchema).min(1, "Every section must contain at least one question"),
});

export const ApplicationDraftSchema = z.object({
  name: z.string().min(1, "Application name cannot be empty"),
  description: z.string().min(1, "Application description cannot be empty"),
  sections: z.array(SectionSchema).min(1, "Form must contain at least one section"),
});

export const EditApplicationResponseSchema = z.object({
  explanation: z.string().optional().default("Updated your application."),
  application: ApplicationDraftSchema,
});

export const IntentSchema = z.enum([
  "FORM_EDIT",
  "FORM_RELATED_CHAT",
  "OUT_OF_SCOPE",
  "AMBIGUOUS",
]);

export const IntentDetectionResponseSchema = z.object({
  intent: IntentSchema,
  confidence: z.number().optional().default(1),
  reasoning: z.string().optional(),
  clarificationMessage: z.string().optional(),
});

export type GeneratedQuestion = z.infer<typeof QuestionSchema>;
export type GeneratedSection = z.infer<typeof SectionSchema>;
export type GeneratedApplicationDraft = z.infer<typeof ApplicationDraftSchema>;
export type EditApplicationResponse = z.infer<typeof EditApplicationResponseSchema>;
export type IntentDetectionResponse = z.infer<typeof IntentDetectionResponseSchema>;
