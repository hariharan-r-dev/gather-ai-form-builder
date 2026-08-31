import { Application } from "../types";
import { DEFAULT_SECTIONS } from "../data/defaultSections";

export function createApplicationSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function generateApplicationName(prompt: string): string {
  if (!prompt) return "New Application";
  return prompt
    .replace(/^create (a|an) /i, "")
    .replace(/application for /i, "")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .substring(0, 50);
}

export function createApplication(name: string): Application {
  return {
    id: `app-${Date.now()}`,
    name,
    status: "draft",
    responses: 0,
    lastUpdated: "just now",
    sections: DEFAULT_SECTIONS,
    description: "Describe what this application collects.",
    slug: createApplicationSlug(name),
  };
}
