import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/* ── RichToolbar ──────────────────────────────────────────────── */
export function RichToolbar({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  function execCmd(cmd: string, value?: string) {
    containerRef.current?.focus();
    document.execCommand(cmd, false, value);
  }

  function handleLink(e: React.MouseEvent) {
    e.preventDefault();
    containerRef.current?.focus();
    const url = window.prompt("URL:");
    if (url) document.execCommand("createLink", false, url);
  }

  const buttons = [
    {
      label: "Bold",
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        execCmd("bold");
      },
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      ),
    },
    {
      label: "Italic",
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        execCmd("italic");
      },
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      ),
    },
    {
      label: "Underline",
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        execCmd("underline");
      },
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3v7a6 6 0 0 0 12 0V3" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      ),
    },
    {
      label: "Insert link",
      onMouseDown: handleLink,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      label: "Remove formatting",
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        execCmd("removeFormat");
      },
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 5l4 4" />
          <path d="M13 10l-4 4" />
          <path d="M3 3l18 18" />
          <path d="M6.2 20H19" />
          <path d="M13.7 4h5.3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm px-1 py-1 flex items-center gap-0.5 z-10">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onMouseDown={btn.onMouseDown}
          className="relative group/btn p-1.5 rounded-md hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          {btn.icon}
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-1.5 py-0.5 bg-[#0F172A] text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-50">
            {btn.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── RichTextField ────────────────────────────────────────────── */
interface RichTextFieldProps {
  html: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  maxHeightClass?: string;
  externalToolbar?: boolean;
  editableRef?: React.RefObject<HTMLDivElement | null>;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function RichTextField({
  html,
  onChange,
  placeholder,
  className,
  maxHeightClass,
  externalToolbar = false,
  editableRef: externalRef,
  onFocus,
  onBlur,
}: RichTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const editableRef = externalRef ?? internalRef;

  useEffect(() => {
    if (editableRef.current && editableRef.current.innerHTML !== html) {
      editableRef.current.innerHTML = html;
    }
  }, [html, editableRef]);

  const showFocusRing = focused || externalToolbar;

  return (
    <div className="relative w-full">
      {!externalToolbar && focused && (
        <div className="mb-1.5">
          <RichToolbar containerRef={editableRef} />
        </div>
      )}
      <div className={showFocusRing && focused ? "ring-1 ring-[#2563EB]/30 rounded-lg" : ""}>
        <div className="relative w-full">
          {!html && (
            <span className="absolute inset-0 text-[#CBD5E1] pointer-events-none select-none leading-snug">
              {placeholder}
            </span>
          )}
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => {
              setFocused(true);
              onFocus?.();
            }}
            onBlur={(e) => {
              setFocused(false);
              onChange(e.currentTarget.innerHTML);
              onBlur?.();
            }}
            onInput={(e) => onChange((e.target as HTMLElement).innerHTML)}
            className={`outline-none w-full${className ? " " + className : ""}${
              maxHeightClass ? " " + maxHeightClass + " overflow-y-auto" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}

/* ── KebabMenu ────────────────────────────────────────────────── */
interface KebabItem {
  label: string;
  action: () => void;
  danger?: boolean;
}

interface KebabMenuProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  items: KebabItem[];
  upward?: boolean;
  buttonClassName?: string;
  iconSize?: number;
}

export function KebabMenu({
  isOpen,
  onOpen,
  onClose,
  items,
  upward = false,
  buttonClassName,
  iconSize = 14,
}: KebabMenuProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (btnRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return;
      onClose();
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, onClose]);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (isOpen) {
      onClose();
      return;
    }
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos(upward ? { x: r.right, y: r.top } : { x: r.right, y: r.bottom });
    }
    onOpen();
  }

  const menuStyle: React.CSSProperties = upward
    ? { position: "fixed", bottom: window.innerHeight - pos.y + 4, right: window.innerWidth - pos.x, zIndex: 9999 }
    : { position: "fixed", top: pos.y + 4, right: window.innerWidth - pos.x, zIndex: 9999 };

  return (
    <>
      <button ref={btnRef} onClick={toggle} className={buttonClassName}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 w-36"
            style={menuStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#F8FAFC] ${
                  item.danger ? "text-red-500 hover:bg-red-50" : "text-[#0F172A]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
