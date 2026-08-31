import { useState } from "react";
import { Application } from "../types";

interface AppSettingsProps {
  app: Application;
  onUpdateApp: (app: Application) => void;
  onBack: () => void;
}

type SettingsSection = "general" | "submission" | "confirmation" | "privacy";

export default function AppSettings({ app, onUpdateApp, onBack }: AppSettingsProps) {
  const [section, setSection] = useState<SettingsSection>("general");
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description);
  const [confirmMsg, setConfirmMsg] = useState("Thank you for your submission! We'll be in touch soon.");
  const [allowSubmissions, setAllowSubmissions] = useState(true);

  function save() {
    onUpdateApp({ ...app, name, description });
  }

  const navItems: { id: SettingsSection; label: string }[] = [
    { id: "general", label: "General" },
    { id: "submission", label: "Submission settings" },
    { id: "confirmation", label: "Confirmation" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
      {/* Left sidebar */}
      <div className="w-56 flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col py-4 px-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-5 px-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to editor
        </button>

        <p className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-2 mb-1">Application</p>
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full text-left px-2 py-2 rounded-lg text-sm transition-colors ${
                section === item.id
                  ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
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
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-6">General</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Application name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 resize-none bg-white"
                  />
                </div>
                <button
                  onClick={save}
                  className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Save changes
                </button>
              </div>
            </div>
          )}

          {section === "submission" && (
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Submission settings</h2>
              <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#F1F5F9]">
                <div className="px-4 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Accept submissions</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Allow people to submit this application</p>
                  </div>
                  <button
                    onClick={() => setAllowSubmissions(!allowSubmissions)}
                    className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${allowSubmissions ? "bg-[#2563EB]" : "bg-[#E2E8F0]"}`}
                    style={{ width: 40, height: 22 }}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${allowSubmissions ? "translate-x-[18px]" : ""}`}
                    />
                  </button>
                </div>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Submission limit</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Automatically close when a limit is reached</p>
                  </div>
                  <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-lg">No limit</span>
                </div>
              </div>
            </div>
          )}

          {section === "confirmation" && (
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Confirmation message</h2>
              <p className="text-sm text-[#64748B] mb-4">This message is shown to people after they submit their application.</p>
              <textarea
                value={confirmMsg}
                onChange={(e) => setConfirmMsg(e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 resize-none bg-white"
              />
              <button className="mt-4 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors">
                Save
              </button>
            </div>
          )}

          {section === "privacy" && (
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Privacy</h2>
              <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#F1F5F9]">
                <div className="px-4 py-4">
                  <p className="text-sm font-medium text-[#0F172A] mb-0.5">Visibility</p>
                  <p className="text-xs text-[#64748B] mb-3">Control who can view and submit this application.</p>
                  <div className="space-y-2">
                    {["Public — anyone with the link", "Private — only invited people"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          defaultChecked={opt.startsWith("Public")}
                          className="accent-[#2563EB]"
                        />
                        <span className="text-sm text-[#0F172A]">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Show Gather branding</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Display "Powered by Gather" on the application</p>
                  </div>
                  <span className="text-xs font-medium text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded-lg">Pro only</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
