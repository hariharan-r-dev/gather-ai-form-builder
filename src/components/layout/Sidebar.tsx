import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, useUIState } from "../../app/AppProvider";

export default function Sidebar() {
  const { user, isSignedIn, setShowAuth } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, setShowSearch, setUpgradeModal } = useUIState();
  const location = useLocation();
  const navigate = useNavigate();

  // Close on Escape key when open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "HR";

  function handleNav(path: string) {
    navigate(path);
    // On mobile viewports, auto-close sidebar after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }

  function handleSearchClick() {
    setShowSearch(true);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }

  function handleUpgradeClick() {
    setUpgradeModal("generic");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }

  function handleHelpClick() {
    navigate("/app/settings");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }

  const isHomeActive = location.pathname === "/app" || location.pathname === "/";
  const isApplicationsActive =
    location.pathname === "/app/applications" ||
    location.pathname === "/applications" ||
    location.pathname.startsWith("/app/applications/") ||
    location.pathname.startsWith("/applications/");

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 md:hidden transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Application sidebar"
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-30
          w-64 bg-white border-r border-[#E2E8F0]
          flex flex-col justify-between
          transition-all duration-200 ease-in-out
          ${isSidebarOpen ? "translate-x-0 md:w-64" : "-translate-x-full md:w-0 md:border-r-0 md:opacity-0 md:pointer-events-none"}
          overflow-hidden select-none
        `}
      >
        <div className="w-64 flex flex-col h-full">
          {/* Top Section */}
          <div className="p-4 border-b border-[#F1F5F9]">
            {/* User Profile Card */}
            <div
              onClick={() => {
                if (!isSignedIn) {
                  setShowAuth(true);
                } else {
                  navigate("/app/settings");
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }
              }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0F172A] truncate group-hover:text-[#2563EB] transition-colors">
                  {user?.name || "Hariharan R"}
                </p>
                <p className="text-[11px] text-[#94A3B8] truncate">
                  {user?.org || `${user?.name || "Hariharan R"}'s organization`}
                </p>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#94A3B8] group-hover:text-[#64748B] flex-shrink-0 transition-transform group-hover:translate-x-0.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>

          {/* Navigation Items (Search, Home, Applications) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* 1. Search */}
            <button
              type="button"
              onClick={handleSearchClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer group"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#94A3B8] group-hover:text-[#0F172A] transition-colors flex-shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span>Search</span>
            </button>

            {/* 2. Home */}
            <button
              type="button"
              onClick={() => handleNav("/app")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                isHomeActive
                  ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={isHomeActive ? "2.5" : "2"}
                className={isHomeActive ? "text-[#2563EB]" : "text-[#94A3B8]"}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </button>

            {/* 3. Applications */}
            <button
              type="button"
              onClick={() => handleNav("/app/applications")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                isApplicationsActive && !isHomeActive
                  ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={isApplicationsActive && !isHomeActive ? "2.5" : "2"}
                className={isApplicationsActive && !isHomeActive ? "text-[#2563EB]" : "text-[#94A3B8]"}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Applications</span>
            </button>
          </nav>

          {/* Bottom Area (Anchored: Help, Upgrade) */}
          <div className="p-3 border-t border-[#F1F5F9] space-y-2">
            {/* 4. Help */}
            <button
              type="button"
              onClick={handleHelpClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer group"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#94A3B8] group-hover:text-[#0F172A] transition-colors"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
              <span>Help</span>
            </button>

            {/* 5. Upgrade (Full Blue CTA) */}
            <button
              type="button"
              onClick={handleUpgradeClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white flex-shrink-0"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>Upgrade</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
