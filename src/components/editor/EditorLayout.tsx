import { useState, useRef, useEffect, cloneElement, ReactElement, ReactNode } from "react";

interface EditorLayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
  settings?: ReactNode;
}

const SIDEBAR_MIN = 300;
const SIDEBAR_MAX = 520;

export default function EditorLayout({ sidebar, canvas, settings }: EditorLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = sidebarWidth;
    setIsResizing(true);
  }

  function handleResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isResizing) return;
    const delta = e.clientX - resizeStartX.current;
    setSidebarWidth(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, resizeStartWidth.current + delta)));
  }

  function handleResizePointerUp() {
    setIsResizing(false);
  }

  function handleResizeKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSidebarWidth((w) => Math.max(SIDEBAR_MIN, w - 20));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSidebarWidth((w) => Math.min(SIDEBAR_MAX, w + 20));
    }
  }

  // Clone sidebar element to pass the width dynamically
  const sidebarWithWidth = sidebar && typeof sidebar === "object" && "props" in sidebar
    ? cloneElement(sidebar as ReactElement<any>, { sidebarWidth })
    : sidebar;

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Sidebar Slot */}
      {sidebarWithWidth}

      {/* Resize handle */}
      <div
        className={`w-1 flex-shrink-0 cursor-col-resize relative group transition-colors focus:outline-none ${
          isResizing ? "bg-[#2563EB]/40" : "bg-[#E2E8F0] hover:bg-[#2563EB]/30"
        }`}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerUp}
        onKeyDown={handleResizeKey}
        tabIndex={0}
        role="separator"
        aria-label="Resize Ask Gather sidebar"
        aria-orientation="vertical"
        aria-valuemin={SIDEBAR_MIN}
        aria-valuemax={SIDEBAR_MAX}
        aria-valuenow={sidebarWidth}
      >
        {/* Wider invisible grab zone */}
        <div className="absolute inset-y-0 -left-1.5 -right-1.5 z-10" />
      </div>

      {/* Canvas Slot */}
      <div className="flex-1 overflow-y-auto min-w-0 bg-[#F8FAFC]">
        {canvas}
      </div>

      {/* Settings Slot */}
      {settings}
    </div>
  );
}

// React import helper
import React from "react";
