import { Section } from "../types";

export function summarizeSection(section: Section): string {
  const title = section.title.toLowerCase();
  const allLabels = (section.questions || []).map((q) => q.label.toLowerCase()).join(" ");

  if (
    title.includes("contact") ||
    title.includes("personal") ||
    allLabels.includes("email") ||
    allLabels.includes("phone") ||
    allLabels.includes("address") ||
    allLabels.includes("name")
  ) {
    return "collects basic contact details.";
  }

  if (
    title.includes("experience") ||
    title.includes("skill") ||
    title.includes("background") ||
    allLabels.includes("experience") ||
    allLabels.includes("skills") ||
    allLabels.includes("resume") ||
    allLabels.includes("work")
  ) {
    return "asks about previous experience and relevant skills.";
  }

  if (
    title.includes("interest") ||
    title.includes("availab") ||
    title.includes("schedule") ||
    allLabels.includes("availability") ||
    allLabels.includes("hours") ||
    allLabels.includes("role") ||
    allLabels.includes("timing")
  ) {
    return "covers preferred roles and availability.";
  }

  if (
    title.includes("motivation") ||
    title.includes("why") ||
    title.includes("statement") ||
    allLabels.includes("why") ||
    allLabels.includes("motivation") ||
    allLabels.includes("goals") ||
    allLabels.includes("interest in")
  ) {
    return "asks why they want to volunteer or apply, and their motivation.";
  }

  if (
    title.includes("education") ||
    title.includes("academic") ||
    allLabels.includes("degree") ||
    allLabels.includes("gpa") ||
    allLabels.includes("university") ||
    allLabels.includes("school") ||
    allLabels.includes("major")
  ) {
    return "gathers educational background and achievements.";
  }

  if (
    title.includes("portfolio") ||
    title.includes("project") ||
    allLabels.includes("portfolio") ||
    allLabels.includes("github") ||
    allLabels.includes("link") ||
    allLabels.includes("url")
  ) {
    return "collects portfolio links and project samples.";
  }

  if (
    title.includes("emergency") ||
    allLabels.includes("emergency") ||
    allLabels.includes("next of kin")
  ) {
    return "collects emergency contact information.";
  }

  if (
    title.includes("additional") ||
    title.includes("other") ||
    title.includes("general") ||
    allLabels.includes("anything else") ||
    allLabels.includes("comments")
  ) {
    return "collects any remaining relevant details.";
  }

  return `collects information related to ${section.title.toLowerCase()}.`;
}

export function buildCreationSummary(name: string, sections: Section[]): string {
  const sectionCount = sections.length;
  const questionCount = sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

  const sectionBullets = sections
    .map((s) => `• ${s.title} — ${summarizeSection(s)}`)
    .join("\n");

  return `Created your ${name}.

I created ${sectionCount} section${sectionCount === 1 ? "" : "s"} with ${questionCount} question${questionCount === 1 ? "" : "s"}:

${sectionBullets}

You can also ask me to:
• Add or remove questions
• Make questions shorter or clearer
• Change question types
• Add or remove sections
• Make questions required or optional
• Reorganize the form

What would you like to change?`;
}
