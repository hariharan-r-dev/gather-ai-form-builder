import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { View, Plan } from "../types";
import { useAuth } from "../app/AppProvider";
import { stripHtml } from "../utils/application";

interface HeaderProps {
  view: View;
  activeNav?: "applications" | "templates";
  onNavChange?: (nav: "applications" | "templates" | "responses") => void;
  onLogoClick?: () => void;
  onSignIn?: () => void;
  isSignedIn?: boolean;
  appName?: string;
  onBackToApps?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onMoreMenu?: (action: string) => void;
  showMoreMenu?: boolean;
  setShowMoreMenu?: (v: boolean) => void;
  plan?: Plan;
  onBilling?: () => void;
  onUpgrade?: () => void;
  onSettings?: () => void;
  onSearchClick?: () => void;
}

function NavDropdown({
  onUpgrade,
}: {
  onUpgrade?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const isApps =
    (location.pathname.startsWith("/app/applications") || location.pathname.startsWith("/applications")) &&
    location.pathname !== "/app/applications/generating" &&
    location.pathname !== "/applications/generating";
  const isHome = !isApps;
  const activeLabel = isApps ? "Applications" : "Home";

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleHomeClick() {
    setIsOpen(false);
    navigate("/app");
  }

  function handleAppsClick() {
    setIsOpen(false);
    navigate("/app/applications");
  }

  function handleUpgradeClick() {
    setIsOpen(false);
    if (onUpgrade) onUpgrade();
    else navigate("/pricing", { state: { from: location.pathname } });
  }

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      {/* Closed State Trigger Button with Dynamic Active Icon and Label */}
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] bg-white transition-all cursor-pointer select-none"
      >
        {isApps ? (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#64748B]"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#64748B]"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        )}
        <span>{activeLabel}</span>
        {/* Chevron down */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[#94A3B8] transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation Items */}
          <div className="space-y-0.5">
            {/* Home */}
            <button
              type="button"
              onClick={handleHomeClick}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                isHome
                  ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                  : "text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isHome ? "text-[#2563EB]" : "text-[#64748B]"}
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
              </div>
              {isHome && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#2563EB]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>

            {/* Applications */}
            <button
              type="button"
              onClick={handleAppsClick}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                isApps
                  ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                  : "text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isApps ? "text-[#2563EB]" : "text-[#64748B]"}
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>Applications</span>
              </div>
              {isApps && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#2563EB]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-1.5 border-t border-[#F1F5F9]" />

          {/* Upgrade CTA */}
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Upgrade</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header({
  view,
  onNavChange,
  onLogoClick,
  onSignIn,
  isSignedIn = false,
  appName,
  onBackToApps,
  onPreview,
  onPublish,
  onMoreMenu,
  showMoreMenu,
  setShowMoreMenu,
  plan = "free",
  onBilling,
  onUpgrade,
  onSettings,
  onSearchClick,
}: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const isEditorMode =
    view === "editor" ||
    view === "preview" ||
    view === "publish" ||
    view === "responses" ||
    view === "applicant-detail" ||
    view === "settings" ||
    view === "app-settings";

  const isCreateMode = view === "create";

  function handleLogoClick() {
    if (onLogoClick) onLogoClick();
    else navigate("/app");
  }

  function AvatarButton() {
    const name = user?.name || "Hariharan R";
    const email = user?.email || "hariharan.creates@gmail.com";
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    function close() {
      setShowAvatarMenu(false);
    }

    function MenuItem({
      icon,
      label,
      onClick,
      badge,
      danger,
    }: {
      icon: React.ReactNode;
      label: string;
      onClick: () => void;
      badge?: string;
      danger?: boolean;
    }) {
      return (
        <button
          onClick={onClick}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors rounded-lg ${
            danger
              ? "text-red-500 hover:bg-red-50"
              : "text-[#0F172A] hover:bg-[#F8FAFC]"
          }`}
        >
          <span className={`flex-shrink-0 ${danger ? "text-red-400" : "text-[#64748B]"}`}>{icon}</span>
          <span className="flex-1 text-left">{label}</span>
          {badge && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] tracking-wide">
              {badge}
            </span>
          )}
        </button>
      );
    }

    function SectionLabel({ children }: { children: React.ReactNode }) {
      return (
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase select-none">
          {children}
        </p>
      );
    }

    function Divider() {
      return <div className="my-1 border-t border-[#F1F5F9]" />;
    }

    return (
      <div className="relative">
        <button
          onClick={() => setShowAvatarMenu((v) => !v)}
          className={`w-7 h-7 rounded-full bg-[#2563EB] text-white text-[11px] font-semibold flex items-center justify-center cursor-pointer transition-opacity ${showAvatarMenu ? "opacity-90" : "hover:opacity-90"}`}
        >
          {initials}
        </button>

        {showAvatarMenu && (
          <div
            className="absolute right-0 top-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] py-2 w-56 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Identity */}
            <div className="flex items-center gap-3 px-3 pb-3 mb-1 border-b border-[#F1F5F9]">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] truncate">{name}</p>
                <p className="text-[11px] text-[#94A3B8] truncate">{email}</p>
              </div>
            </div>

            {/* Account */}
            <SectionLabel>Account</SectionLabel>
            <div className="px-1.5">
              <MenuItem
                onClick={() => {
                  close();
                  onSettings
                    ? onSettings()
                    : navigate("/settings", { state: { from: location.pathname } });
                }}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.07 4.93A10 10 0 0 1 21.19 9.5M4.93 19.07A10 10 0 0 1 2.81 14.5M14.5 21.19A10 10 0 0 1 9.5 21.19M14.5 2.81A10 10 0 0 1 19.07 4.93M4.93 4.93A10 10 0 0 1 9.5 2.81" />
                  </svg>
                }
                label="Account settings"
              />
              <MenuItem
                onClick={() => {
                  close();
                  onBilling
                    ? onBilling()
                    : navigate("/pricing", { state: { from: location.pathname } });
                }}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                }
                label="Plans & billing"
                badge={plan === "pro" ? "Pro" : "Free"}
              />
            </div>

            <Divider />

            {/* Resources */}
            <SectionLabel>Resources</SectionLabel>
            <div className="px-1.5">
              <MenuItem
                onClick={close}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                }
                label="What's new"
              />
              <MenuItem
                onClick={close}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                }
                label="Contact support"
              />
            </div>

            <Divider />

            {/* Grow Gather */}
            <SectionLabel>Grow Gather</SectionLabel>
            <div className="px-1.5">
              <MenuItem
                onClick={close}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                }
                label="Refer & earn"
              />
            </div>

            <Divider />

            {/* Log out */}
            <div className="px-1.5">
              <MenuItem
                onClick={close}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                }
                label="Log out"
                danger
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] h-14 flex items-center px-4 gap-3 select-none"
      onClick={() => showAvatarMenu && setShowAvatarMenu(false)}
    >
      {/* ── Left Navigation: Gather Brand First | Vertical Divider | Nav Dropdown ── */}
      <div className="flex items-center min-w-0">
        <button
          onClick={handleLogoClick}
          className="text-[15px] font-semibold text-[#0F172A] tracking-tight hover:opacity-80 transition-opacity flex-shrink-0 cursor-pointer mr-0.5"
        >
          Gather
        </button>

        {/* Subtle Vertical Divider */}
        <div className="h-4 w-px bg-[#E2E8F0] mx-2.5 flex-shrink-0" />

        <NavDropdown onUpgrade={onUpgrade} />

        {isEditorMode ? (
          <div className="flex items-center gap-1.5 min-w-0 ml-1.5">
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-xs font-semibold text-[#0F172A] truncate max-w-[180px] sm:max-w-[240px]">
              {stripHtml(appName) || "Untitled Application"}
            </span>
          </div>
        ) : isCreateMode ? (
          <div className="flex items-center gap-1.5 min-w-0 ml-1.5">
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-xs font-medium text-[#0F172A]">Create application</span>
          </div>
        ) : null}
      </div>

      <div className="flex-1" />

      {/* ── Right Navigation / Tools ── */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {isEditorMode && (
          <>
            {(view === "editor" || view === "responses" || view === "app-settings") && (
              <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden text-xs font-medium mr-1">
                <button
                  onClick={() => onNavChange && onNavChange("applications")}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    view === "editor" || view === "app-settings"
                      ? "bg-[#F8FAFC] text-[#0F172A]"
                      : "text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Build
                </button>
                <button
                  onClick={() => onNavChange && onNavChange("responses")}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    view === "responses"
                      ? "bg-[#F8FAFC] text-[#0F172A]"
                      : "text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  Submissions
                </button>
              </div>
            )}
            <button
              onClick={onPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Preview
            </button>
            <button
              onClick={onPublish}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Publish
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu && setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                  <circle cx="12" cy="19" r="1" fill="currentColor" />
                </svg>
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 w-44 z-50">
                  {["Save draft", "Duplicate", "Settings", "Delete"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        onMoreMenu && onMoreMenu(item.toLowerCase());
                        setShowMoreMenu && setShowMoreMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-[#F8FAFC] cursor-pointer ${
                        item === "Delete" ? "text-red-500" : "text-[#0F172A]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Search Bar */}
        {!isEditorMode && !isCreateMode && (
          <div className="relative w-48 sm:w-56">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              readOnly
              onClick={onSearchClick}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg placeholder:text-[#94A3B8] text-[#0F172A] focus:outline-none cursor-pointer transition-colors hover:border-[#CBD5E1]"
            />
          </div>
        )}

        {/* User Identity / Avatar Button (only on global pages, removed from editor/creator header) */}
        {!isEditorMode && !isCreateMode && (
          isSignedIn ? (
            <AvatarButton />
          ) : (
            <button
              onClick={onSignIn}
              className="px-3 py-1.5 text-xs font-medium text-[#0F172A] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Sign in
            </button>
          )
        )}
      </div>
    </header>
  );
}
