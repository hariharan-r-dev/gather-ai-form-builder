import { useNavigate } from "react-router-dom";
import { useAuth, useUIState } from "../app/AppProvider";
import CreateApplication from "../components/CreateApplication";

export default function CreateApplicationPage() {
  const { isSignedIn, setShowAuth, setPendingCreatePrompt } = useAuth();
  const { createPrompt, setGeneratePrompt } = useUIState();
  const navigate = useNavigate();

  function handleGenerate(prompt: string) {
    setGeneratePrompt(prompt);
    navigate("/applications/generating");
  }

  function handleRequireAuth(prompt: string) {
    setPendingCreatePrompt(prompt);
    setShowAuth(true);
  }

  return (
    <CreateApplication
      onGenerate={handleGenerate}
      onRequireAuth={handleRequireAuth}
      isSignedIn={isSignedIn}
      defaultPrompt={createPrompt}
    />
  );
}
