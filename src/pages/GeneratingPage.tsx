import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUIState, useApplications, useCurrentApplication } from "../app/AppProvider";
import { generateApplication } from "../services/ai/generateApplication";
import GeneratingScreen from "../components/GeneratingScreen";

export default function GeneratingPage() {
  const { generatePrompt } = useUIState();
  const { createApp } = useApplications();
  const { setCurrentApp } = useCurrentApplication();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const [generatedData, setGeneratedData] = useState<any | null>(null);
  const hasTriggered = useRef(false);

  const runGeneration = async () => {
    const cleanPrompt = generatePrompt ? generatePrompt.trim() : "";
    if (!cleanPrompt) {
      setError("Describe the application you want to create.");
      return;
    }

    try {
      const result = await generateApplication(cleanPrompt);
      setGeneratedData(result);
    } catch (err: any) {
      console.error("AI form generation failed:", err);
      setError(
        err.message || "Something went wrong while generating your form. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      runGeneration();
    }
  }, []);

  // Sync completion when both steps animation is finished and API data has resolved
  useEffect(() => {
    if (animationDone && generatedData) {
      createApp(
        generatedData.name,
        generatedData.description,
        generatedData.sections,
        generatePrompt.trim()
      )
        .then((app) => {
          setCurrentApp(app);
          navigate(`/applications/${app.id}`);
        })
        .catch((err) => {
          setError(err.message || "Failed to create application draft.");
        });
    }
  }, [animationDone, generatedData, createApp, navigate, setCurrentApp, generatePrompt]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-2">Couldn't create your application</h2>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => {
                setError(null);
                setGeneratedData(null);
                setAnimationDone(false);
                hasTriggered.current = true;
                runGeneration();
              }}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GeneratingScreen
      prompt={generatePrompt}
      onDone={() => setAnimationDone(true)}
    />
  );
}
