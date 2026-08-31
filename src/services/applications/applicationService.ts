import { Application, Section } from "../../types";
import { createApplication } from "../../utils/application";
import { buildCreationSummary } from "../../utils/creationSummary";

const STORAGE_KEY = "gather_applications";

function getStoredApplications(): Application[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveStoredApplications(apps: Application[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

export const applicationService = {
  async getApplications(): Promise<Application[]> {
    return getStoredApplications();
  },

  async getApplication(id: string): Promise<Application | null> {
    const apps = getStoredApplications();
    return apps.find((a) => a.id === id) || null;
  },

  async getApplicationBySlug(slug: string): Promise<Application | null> {
    const apps = getStoredApplications();
    const cleanSlug = slug.toLowerCase().trim();
    return apps.find((a) => a.slug?.toLowerCase() === cleanSlug || a.id === slug) || null;
  },

  async createApplication(
    name: string,
    description?: string,
    sections?: Section[],
    creationPrompt?: string
  ): Promise<Application> {
    const baseApp = createApplication(name);
    const activeSections = sections !== undefined ? sections : baseApp.sections;
    const initialHistory = creationPrompt
      ? [
          {
            id: `msg-create-user-${Date.now()}`,
            role: "user" as const,
            content: creationPrompt,
            createdAt: new Date().toISOString(),
          },
          {
            id: `msg-create-assistant-${Date.now() + 1}`,
            role: "assistant" as const,
            content: buildCreationSummary(name, activeSections),
            createdAt: new Date().toISOString(),
            feedback: null,
            mutation: false,
          },
        ]
      : [];

    const newApp: Application = {
      ...baseApp,
      description: description !== undefined ? description : baseApp.description,
      sections: sections !== undefined ? sections : baseApp.sections,
      creationPrompt: creationPrompt || undefined,
      askGatherHistory: initialHistory,
    };
    const apps = getStoredApplications();
    saveStoredApplications([newApp, ...apps]);
    return newApp;
  },

  async updateApplication(app: Application): Promise<Application> {
    const apps = getStoredApplications();
    const updated = apps.map((a) => (a.id === app.id ? { ...app, lastUpdated: "just now" } : a));
    saveStoredApplications(updated);
    return app;
  },

  async incrementResponses(id: string): Promise<number> {
    const apps = getStoredApplications();
    let newCount = 1;
    const updated = apps.map((a) => {
      if (a.id === id) {
        newCount = (a.responses || 0) + 1;
        return { ...a, responses: newCount, lastUpdated: "just now" };
      }
      return a;
    });
    saveStoredApplications(updated);
    return newCount;
  },

  async deleteApplication(id: string): Promise<void> {
    const apps = getStoredApplications();
    saveStoredApplications(apps.filter((a) => a.id !== id));
  },

  async duplicateApplication(app: Application): Promise<Application> {
    const dup: Application = {
      ...app,
      id: `app-${Date.now()}`,
      name: app.name + " (copy)",
      status: "draft",
      responses: 0,
      lastUpdated: "just now",
    };
    const apps = getStoredApplications();
    saveStoredApplications([dup, ...apps]);
    return dup;
  },
};
