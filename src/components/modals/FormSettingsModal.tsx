import { useState } from "react";
import { Application } from "../../types";

interface FormSettingsModalProps {
  app: Application;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export default function FormSettingsModal({ app, onClose, onSave }: FormSettingsModalProps) {
  const [section, setSection] = useState<"general" | "submission" | "confirmation" | "privacy">("general");
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description || "");
  const [allowSubmissions, setAllowSubmissions] = useState(true);
  const [confirmMsg, setConfirmMsg] = useState("Thank you for your submission! We'll be in touch soon.");

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative flex flex-col overflow-hidden"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <h2 className="text-base font-semibold text-[#0F172A]">Form settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body: sidebar + content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left nav */}
          <div className="w-48 flex-shrink-0 border-r border-[#E2E8F0] py-4 px-3 bg-[#F8FAFC]">
            <p className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-2 mb-1">Application</p>
            <div className="space-y-0.5">
              {(["general", "submission", "confirmation", "privacy"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`w-full text-left px-2 py-2 rounded-lg text-sm transition-colors capitalize ${
                    section === id
                      ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                      : "text-[#64748B] hover:bg-white hover:text-[#0F172A]"
                  }`}
                >
                  {id === "submission" ? "Submission settings" : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {section === "general" && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-[#0F172A]">General</h3>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Application name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 bg-white text-[#0f172a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 resize-none bg-white text-[#0f172a]"
                  />
                </div>
              </div>
            )}

            {section === "submission" && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Submission settings</h3>
                <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#F1F5F9]">
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Accept submissions</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Allow people to submit this application</p>
                    </div>
                    <button
                      onClick={() => setAllowSubmissions(!allowSubmissions)}
                      style={{ width: 40, height: 22 }}
                      className={`relative rounded-full transition-colors flex-shrink-0 ${
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
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Submission limit</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Automatically close when a limit is reached</p>
                    </div>
                    <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-lg font-medium">No limit</span>
                  </div>
                </div>
              </div>
            )}

            {section === "confirmation" && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A] mb-1">Confirmation message</h3>
                <p className="text-sm text-[#64748B] mb-4">Shown to people after they submit their application.</p>
                <textarea
                  value={confirmMsg}
                  onChange={(e) => setConfirmMsg(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 resize-none bg-white text-[#0f172a]"
                />
              </div>
            )}

            {section === "privacy" && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Privacy</h3>
                <div className="bg-white border border-[#E2E8F0] rounded-xl divide-y divide-[#F1F5F9]">
                  <div className="px-4 py-4">
                    <p className="text-sm font-medium text-[#0F172A] mb-0.5">Visibility</p>
                    <p className="text-xs text-[#64748B] mb-3">Control who can view and submit this application.</p>
                    <div className="space-y-2">
                      {["Public — anyone with the link", "Private — only invited people"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="fs-visibility"
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

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#E2E8F0] flex-shrink-0 bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(name, description)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
