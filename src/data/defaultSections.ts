import { Section } from "../types";

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: "s1",
    title: "Personal Information",
    questions: [
      { id: "q1", label: "Full name", type: "short_answer", required: true },
      { id: "q2", label: "Email", type: "email", required: true },
      { id: "q3", label: "Portfolio", type: "url", required: true },
    ],
  },
  {
    id: "s2",
    title: "Background",
    questions: [
      { id: "q4", label: "Years of UX experience", type: "short_answer", required: true },
      { id: "q5", label: "Current role", type: "short_answer", required: false },
    ],
  },
  {
    id: "s3",
    title: "Experience",
    questions: [
      { id: "q6", label: "Tell us about your design process", type: "long_answer", required: true },
      { id: "q7", label: "Describe a challenging design problem you solved", type: "long_answer", required: true },
    ],
  },
  {
    id: "s4",
    title: "Additional Questions",
    questions: [
      { id: "q8", label: "Why do you want to join our team?", type: "long_answer", required: false },
      { id: "q9", label: "Availability", type: "dropdown", required: true, options: ["Immediate", "2 weeks", "1 month", "3+ months"] },
    ],
  },
];
