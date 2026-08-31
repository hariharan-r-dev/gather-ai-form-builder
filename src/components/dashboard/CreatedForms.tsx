import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Application, AppStatus } from "../../types";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";

const imgListView = "/assets/f513e.svg";
const imgGridView = "/assets/c7445.svg";

const STATUS_COLORS: Record<AppStatus, { dot: string; bg: string; text: string; label: string }> = {
  draft: { dot: "bg-[#94A3B8]", bg: "bg-[#F1F5F9]", text: "text-[#64748B]", label: "Draft" },
  published: { dot: "bg-[#2563EB]", bg: "bg-[#EFF6FF]", text: "text-[#2563EB]", label: "Published" },
  closed: { dot: "bg-[#E2E8F0]", bg: "bg-[#F8FAFC]", text: "text-[#94A3B8]", label: "Closed" },
};

const SORT_OPTIONS = [
  { value: "updated", label: "Recently updated" },
  { value: "created", label: "Recently created" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

function getRowActions(
  app: Application,
  onOpenApp: (a: Application) => void,
  onDuplicateApp: (a: Application) => void,
  onDeleteApp: (a: Application) => void,
  closeMenu: () => void
): { label: string; action: () => void; danger?: boolean }[] {
  const open = { label: "Edit", action: () => { onOpenApp(app); closeMenu(); } };
  const preview = { label: "Preview", action: () => { onOpenApp(app); closeMenu(); } };
  const viewSubs = { label: "View submissions", action: () => { onOpenApp(app); closeMenu(); } };
  const duplicate = { label: "Duplicate", action: () => { onDuplicateApp(app); closeMenu(); } };
  const del = { label: "Delete", action: () => { onDeleteApp(app); closeMenu(); }, danger: true };

  if (app.status === "draft") return [open, preview, { label: "Publish", action: closeMenu }, duplicate, del];
  if (app.status === "published") return [open, preview, viewSubs, { label: "Copy link", action: closeMenu }, { label: "Close application", action: closeMenu }, duplicate, del];
  return [{ label: "View", action: () => { onOpenApp(app); closeMenu(); } }, viewSubs, duplicate, del];
}

interface CreatedFormsProps {
  applications: Application[];
  onOpenApp: (app: Application) => void;
  onCreateClick: () => void;
  onDuplicateApp: (app: Application) => void;
  onDeleteApp: (id: string) => void;
}

export default function CreatedForms({
  applications,
  onOpenApp,
  onCreateClick,
  onDuplicateApp,
  onDeleteApp,
}: CreatedFormsProps) {
  const [sort, setSort] = useState("updated");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openMenuPos, setOpenMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSortMenu) return;
    function onMouseDown(e: MouseEvent) {
      if (sortMenuRef.current?.contains(e.target as Node)) return;
      setShowSortMenu(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [showSortMenu]);

  useEffect(() => {
    if (!openMenuId) return;
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpenMenuId(null);
      setOpenMenuPos(null);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openMenuId]);

  function handleKebabClick(e: React.MouseEvent, appId: string) {
    e.stopPropagation();
    if (openMenuId === appId) {
      setOpenMenuId(null);
      setOpenMenuPos(null);
      return;
    }
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOpenMenuPos({ x: r.right, y: r.bottom });
    setOpenMenuId(appId);
  }

  const filtered = useMemo(() => {
    let list = [...applications];
    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "created") list.reverse();
    return list;
  }, [applications, sort]);

  const isEmpty = applications.length === 0;

  const openMenuApp = openMenuId ? (applications.find((a) => a.id === openMenuId) ?? null) : null;
  const openMenuActions = openMenuApp
    ? getRowActions(openMenuApp, onOpenApp, onDuplicateApp, setAppToDelete, () => {
      setOpenMenuId(null);
      setOpenMenuPos(null);
    })
    : [];

  return (
    <>
      {/* Created Forms — sticky section header */}
      <div className="sticky z-20 mt-6 ">
        <div className="max-w-[896px] mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="text-[16px] font-semibold text-[#0F172A] leading-[28px] whitespace-nowrap">Created Forms</p>
              <span className="text-[12px] text-[#94A3B8] whitespace-nowrap">
                {filtered.length} application{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort dropdown */}
            <div ref={sortMenuRef} className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="bg-white border border-[#E2E8F0] rounded-xl flex items-center gap-1.5 px-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer text-[13px] text-[#64748B] select-none"
                style={{ height: 32 }}
              >
                <span>{SORT_OPTIONS.find((o) => o.value === sort)?.label}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="pointer-events-none flex-shrink-0 text-[#94A3B8]">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 w-[180px] z-30 overflow-hidden">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => {
                        setSort(o.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors hover:bg-[#F8FAFC] cursor-pointer ${
                        sort === o.value ? "text-[#2563EB] font-medium bg-[#EFF6FF]/50" : "text-[#64748B]"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List/grid toggle */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl flex overflow-hidden" style={{ height: 32 }}>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center p-2 transition-colors ${viewMode === "list" ? "bg-[#F1F5F9]" : ""
                  }`}
              >
                <img src={imgListView} alt="List view" width={14} height={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center p-2 border-l border-[#E2E8F0] transition-colors ${viewMode === "grid" ? "bg-[#F1F5F9]" : ""
                  }`}
              >
                <img src={imgGridView} alt="Grid view" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Created Forms — content */}
      <div className="max-w-[896px] mx-auto px-6 pb-10">
        <div className="mt-5">
          {filtered.length === 0 ? (
            <div
              className="bg-white border border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center text-center px-8"
              style={{ minHeight: 160 }}
            >
              <p className="text-sm font-semibold text-[#0F172A] mb-1">No applications yet</p>
              <p className="text-sm text-[#64748B]">Describe what you need above and click Create.</p>
            </div>
          ) : viewMode === "list" ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left px-5 py-3 text-[12px] font-medium text-[#64748B]">Application</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-[#64748B] hidden sm:table-cell">Submissions</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-[#64748B]">Status</th>
                    <th className="text-left px-4 py-3 text-[12px] font-medium text-[#64748B] hidden md:table-cell">Updated</th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app, i) => {
                    const s = STATUS_COLORS[app.status];
                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-[#F8FAFC] transition-colors ${i < filtered.length - 1 ? "border-b border-[#E2E8F0]" : ""
                          }`}
                      >
                        <td
                          className="px-5 py-[17px] cursor-pointer text-[14px] font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors"
                          onClick={() => onOpenApp(app)}
                        >
                          {app.name}
                        </td>
                        <td
                          className="px-4 py-[17px] text-[14px] text-[#64748B] hidden sm:table-cell cursor-pointer"
                          onClick={() => onOpenApp(app)}
                        >
                          {app.responses}
                        </td>
                        <td className="px-4 py-[17px] cursor-pointer" onClick={() => onOpenApp(app)}>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-medium ${s.bg} ${s.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                            {s.label}
                          </span>
                        </td>
                        <td
                          className="px-4 py-[17px] text-[12px] text-[#94A3B8] hidden md:table-cell cursor-pointer"
                          onClick={() => onOpenApp(app)}
                        >
                          {app.lastUpdated}
                        </td>
                        <td className="px-4 py-[17px]">
                          <div className="flex justify-end">
                            <button
                              onClick={(e) => handleKebabClick(e, app.id)}
                              className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                            >
                              <svg width="14" height="14" viewBox="0 0 4 16" fill="currentColor">
                                <circle cx="2" cy="2" r="1.5" />
                                <circle cx="2" cy="8" r="1.5" />
                                <circle cx="2" cy="14" r="1.5" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map((app) => {
                const s = STATUS_COLORS[app.status];
                return (
                  <div
                    key={app.id}
                    className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-[#2563EB]/40 hover:shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                          {s.label}
                        </span>
                        <div className="relative">
                          <button
                            onClick={(e) => handleKebabClick(e, app.id)}
                            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 4 16" fill="currentColor">
                              <circle cx="2" cy="2" r="1.5" />
                              <circle cx="2" cy="8" r="1.5" />
                              <circle cx="2" cy="14" r="1.5" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p
                        className="text-sm font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-1 leading-snug cursor-pointer"
                        onClick={() => onOpenApp(app)}
                      >
                        {app.name}
                      </p>
                      <p className="text-xs text-[#94A3B8] mb-3">
                        {app.responses} submission{app.responses !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="text-xs text-[#CBD5E1]">Updated {app.lastUpdated}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Kebab menu Portal */}
      {openMenuId && openMenuPos && createPortal(
        <div
          ref={menuRef}
          className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 w-48"
          style={{ position: "fixed", top: openMenuPos.y + 4, right: window.innerWidth - openMenuPos.x, zIndex: 9999 }}
          onClick={(e) => e.stopPropagation()}
        >
          {openMenuActions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#F8FAFC] ${item.danger ? "text-red-500 hover:bg-red-50" : "text-[#0F172A]"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* Delete confirmation modal */}
      {appToDelete && (
        <DeleteConfirmModal
          appName={appToDelete.name}
          onClose={() => setAppToDelete(null)}
          onConfirm={() => {
            onDeleteApp(appToDelete.id);
            setAppToDelete(null);
          }}
        />
      )}
    </>
  );
}
