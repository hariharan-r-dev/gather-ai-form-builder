import { Application, AppStatus } from "../types";
import { DEFAULT_SECTIONS } from "../data/defaultSections";

export function stripHtml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function createApplicationSlug(name: string): string {
  const clean = stripHtml(name);
  const base = clean
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "application";
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

export function getPublicFormIdentifier(app: { id: string; slug?: string; publicId?: string }): string {
  const cleanSlug = app.slug ? stripHtml(app.slug).trim() : "";
  if (cleanSlug && cleanSlug !== "untitled-form") {
    return cleanSlug;
  }
  return app.publicId || app.slug || app.id;
}

export function getPublicFormPath(app: { id: string; slug?: string; publicId?: string }): string {
  const identifier = getPublicFormIdentifier(app);
  return `/apply/${identifier}`;
}

export function getPublicFormUrl(app: { id: string; slug?: string; publicId?: string }): string {
  const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
  return `${origin}${getPublicFormPath(app)}`;
}

export function getPublicFormDisplayUrl(app: { id: string; slug?: string; publicId?: string }): string {
  const host = typeof window !== "undefined" && window.location?.host ? window.location.host : "";
  return `${host}${getPublicFormPath(app)}`;
}

export function isFormClosed(app: Application): boolean {
  if (app.status === "closed") return true;
  if (app.settings?.endTime?.enabled && app.settings.endTime.date) {
    const timeStr = app.settings.endTime.time || "23:59";
    const endDateTime = new Date(`${app.settings.endTime.date}T${timeStr}`);
    if (!isNaN(endDateTime.getTime()) && new Date() >= endDateTime) {
      return true;
    }
  }
  if (
    app.settings?.submissionLimit?.enabled &&
    typeof app.settings.submissionLimit.limit === "number" &&
    (app.responses || 0) >= app.settings.submissionLimit.limit
  ) {
    return true;
  }
  return false;
}

export function getAppStatus(app: Application): AppStatus {
  if (app.status === "draft") return "draft";
  if (isFormClosed(app)) return "closed";
  return "published";
}

export function createApplication(name: string): Application {
  const cleanName = stripHtml(name) || "Untitled Form";
  const slug = createApplicationSlug(cleanName);
  const id = `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return {
    id,
    publicId: id,
    name: cleanName,
    status: "draft",
    responses: 0,
    lastUpdated: "just now",
    sections: DEFAULT_SECTIONS,
    description: "Describe what this application collects.",
    slug,
    settings: {
      defaultQuestionRequired: true,
      allowResponseEditing: false,
    },
  };
}
