import { useState } from "react";
import { Application, FormSettings } from "../types";
import { stripHtml, createApplicationSlug } from "../utils/application";

interface AppSettingsProps {
  app: Application;
  onUpdateApp: (app: Application) => void;
  onBack: () => void;
}

type SettingsSection = "general" | "submission" | "question-defaults" | "confirmation" | "privacy";

export default function AppSettings({ app, onUpdateApp, onBack }: AppSettingsProps) {
  const [section, setSection] = useState<SettingsSection>("general");
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description || "");

  // Settings state
  const existingSettings: FormSettings = app.settings || {};
  const [allowSubmissions, setAllowSubmissions] = useState(app.status !== "closed");

  // Form End Time
  const [endTimeEnabled, setEndTimeEnabled] = useState(Boolean(existingSettings.endTime?.enabled));
  const [endDate, setEndDate] = useState(existingSettings.endTime?.date || "");
  const [endTime, setEndTime] = useState(existingSettings.endTime?.time || "23:59");

  // Submission limit
  const [subLimitEnabled, setSubLimitEnabled] = useState(Boolean(existingSettings.submissionLimit?.enabled));
  const [subLimit, setSubLimit] = useState(existingSettings.submissionLimit?.limit ?? 100);

  // Allow responses to be edited
  const [allowResponseEditing, setAllowResponseEditing] = useState(
    existingSettings.allowResponseEditing ?? false
  );

  // Question defaults
  const [defaultQuestionRequired, setDefaultQuestionRequired] = useState(
    existingSettings.defaultQuestionRequired ?? true
  );

  const [confirmMsg, setConfirmMsg] = useState("Thank you for your submission! We'll be in touch soon.");

  function handleSave() {
    const cleanName = stripHtml(name);
    const updatedSettings: FormSettings = {
      ...existingSettings,
      endTime: {
        enabled: endTimeEnabled,
        date: endDate || undefined,
        time: endTime || undefined,
      },
      submissionLimit: {
        enabled: subLimitEnabled,
        limit: Number(subLimit) || 100,
      },
      allowResponseEditing,
      defaultQuestionRequired,
    };

    const shouldUpdateSlug =
      !app.slug ||
      app.slug === "untitled-form" ||
      app.slug === createApplicationSlug(app.name);

    onUpdateApp({
      ...app,
      name,
      description,
      slug: shouldUpdateSlug ? createApplicationSlug(cleanName) : app.slug,
      status: !allowSubmissions ? "closed" : app.status === "closed" ? "published" : app.status,
      isPublic: true,
      settings: updatedSettings,
    });
  }

  const navItems: { id: SettingsSection; label: string }[] = [
    { id: "general", label: "General" },
    { id: "submission", label: "Submission settings" },
    { id: "question-defaults", label: "Question defaults" },
    { id: "confirmation", label: "Confirmation" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
      {/* Left sidebar */}
      <div className="w-56 flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col py-4 px-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors mb-5 px-2 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to editor
        </button>

        <p className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-2 mb-1.5">
          Settings
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                section === item.id
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-8 py-8">
          {section === "general" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">General</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Application name and description.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0F172A] mb-1.5">Application name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0F172A] mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] resize-none bg-white text-[#0F172A]"
                />
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Save changes
              </button>
            </div>
          )}

          {section === "submission" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Submission settings</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Control form closure, submission limits, and respondent editing.</p>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F1F5F9] shadow-2xs">
                {/* Accept Submissions */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A]">Accept submissions</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Allow people to submit this application</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowSubmissions(!allowSubmissions)}
                    style={{ width: 40, height: 22 }}
                    className={`relative rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                      allowSubmissions ? "bg-[#2563EB]" : "bg-[#E2E8F0]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${
                        allowSubmissions ? "translate-x-[18px]" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Form End Time */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A]">Form end time</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Automatically stop accepting responses after a specific date and time.</p>
                  </div>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#0F172A]">
                      <input
                        type="radio"
                        name="appEndTimeChoice"
                        checked={!endTimeEnabled}
                        onChange={() => setEndTimeEnabled(false)}
                        className="accent-[#2563EB] cursor-pointer"
                      />
                      <span>No end time</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#0F172A]">
                      <input
                        type="radio"
                        name="appEndTimeChoice"
                        checked={endTimeEnabled}
                        onChange={() => setEndTimeEnabled(true)}
                        className="accent-[#2563EB] cursor-pointer"
                      />
                      <span>Close form on</span>
                    </label>
                    {endTimeEnabled && (
                      <div className="flex items-center gap-2.5 pl-6 pt-1">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="px-2.5 py-1.5 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                        />
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="px-2.5 py-1.5 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Automatic Close after Submission Limit */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Close form after submission limit</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">Automatically stop accepting responses when this limit is reached.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubLimitEnabled(!subLimitEnabled)}
                      style={{ width: 40, height: 22 }}
                      className={`relative rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                        subLimitEnabled ? "bg-[#2563EB]" : "bg-[#E2E8F0]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${
                          subLimitEnabled ? "translate-x-[18px]" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {subLimitEnabled && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-[#64748B]">Close after</span>
                      <input
                        type="number"
                        min={1}
                        value={subLimit}
                        onChange={(e) => setSubLimit(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-2.5 py-1 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                      />
                      <span className="text-xs text-[#64748B]">submissions</span>
                    </div>
                  )}
                </div>

                {/* Response Editing */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A]">Allow responses to be edited after submitting</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Let respondents update their answers after they submit.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowResponseEditing(!allowResponseEditing)}
                    style={{ width: 40, height: 22 }}
                    className={`relative rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                      allowResponseEditing ? "bg-[#2563EB]" : "bg-[#E2E8F0]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${
                        allowResponseEditing ? "translate-x-[18px]" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Save changes
              </button>
            </div>
          )}

          {section === "question-defaults" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Question defaults</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Settings applied to all new questions.</p>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A]">Make questions required by default</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Newly created questions will be marked as required by default.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDefaultQuestionRequired(!defaultQuestionRequired)}
                    style={{ width: 40, height: 22 }}
                    className={`relative rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                      defaultQuestionRequired ? "bg-[#2563EB]" : "bg-[#E2E8F0]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${
                        defaultQuestionRequired ? "translate-x-[18px]" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Save changes
              </button>
            </div>
          )}

          {section === "confirmation" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Confirmation message</h2>
                <p className="text-xs text-[#64748B] mt-0.5">This message is shown to people after they submit their application.</p>
              </div>
              <textarea
                value={confirmMsg}
                onChange={(e) => setConfirmMsg(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] resize-none bg-white text-[#0F172A]"
              />
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Save changes
              </button>
            </div>
          )}

          {section === "privacy" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Privacy &amp; Branding</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Control form access and footer branding.</p>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F1F5F9] shadow-2xs">
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#0F172A] mb-0.5">Visibility</p>
                  <p className="text-[11px] text-[#64748B] mb-3">Control who can view and submit this application.</p>
                  <div className="space-y-2">
                    {["Public — anyone with the link", "Private — only invited people"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2.5 cursor-pointer text-xs text-[#0F172A]">
                        <input
                          type="radio"
                          name="app-visibility"
                          defaultChecked={opt.startsWith("Public")}
                          className="accent-[#2563EB]"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A]">Show Gather branding</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Display &quot;Powered by Gather&quot; on the application</p>
                  </div>
                  <span className="text-[11px] font-medium text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-lg">Pro only</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
