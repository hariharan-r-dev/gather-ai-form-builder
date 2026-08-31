import { useState } from "react";

const CELL_SIZE = 20;

const HERO_CELLS = (() => {
  const cells: { row: number; col: number; color: string; opacity: number }[] = [];
  let s = 1337;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const ROWS = 11; // covers 212px
  const COLS = 96; // covers up to 1920px

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const v = rand();
      if (v < 0.012) {
        cells.push({ row, col, color: "#2563EB", opacity: 0.48 });
      } else if (v < 0.055) {
        cells.push({ row, col, color: "#60A5FA", opacity: 0.62 });
      } else if (v < 0.15) {
        cells.push({ row, col, color: "#93C5FD", opacity: 0.58 });
      } else if (v < 0.38) {
        cells.push({ row, col, color: "#BFDBFE", opacity: 0.72 });
      }
    }
  }
  return cells;
})();

interface HeroCreateProps {
  onCreateApp: (prompt: string) => void;
}

export default function HeroCreate({ onCreateApp }: HeroCreateProps) {
  const [prompt, setPrompt] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{
        height: 212,
        backgroundColor: "#DBEAFE",
        backgroundImage: `
          linear-gradient(rgba(147,197,253,0.28) 1px, transparent 1px),
          linear-gradient(90deg, rgba(147,197,253,0.28) 1px, transparent 1px)
        `,
        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
      }}
    >
      {/* Fine grid cells */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {HERO_CELLS.map((cell, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: cell.col * CELL_SIZE,
              top: cell.row * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: cell.color,
              opacity: cell.opacity,
            }}
          />
        ))}
      </div>

      {/* Floating prompt card */}
      <div
        className={`relative bg-white border rounded-2xl flex flex-col items-start p-1.5 w-full mx-6 transition-all duration-150 ${
          inputFocused ? "border-[#93C5FD]" : "border-[#E2E8F0]"
        }`}
        style={{
          maxWidth: 600,
          boxShadow: inputFocused
            ? "0px 0px 0px 3px rgba(37,99,235,0.10), 0px 1px 2px rgba(0,0,0,0.08)"
            : "0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)",
        }}
      >
        <div className="w-full px-3 pt-2.5 pb-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the application you need..."
            rows={3}
            className="w-full text-sm text-[#0F172A] bg-transparent outline-none resize-none placeholder:text-[#94A3B8] leading-[22.75px] font-normal"
            style={{ minHeight: 72 }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
                e.preventDefault();
                onCreateApp(prompt.trim());
              }
            }}
          />
        </div>
        <div className="flex items-center justify-between w-full px-3 pb-2.5">
          <p className="text-[12px] text-[#B0BAC9] leading-[16px]">
            Try:{" "}
            <span
              className="text-[#94A3B8] cursor-pointer hover:text-[#64748B] transition-colors"
              onClick={() => setPrompt("Create a job application for a junior UX designer...")}
            >
              Create a job application for a junior UX designer...
            </span>
          </p>
          <div className="flex items-center gap-2">
            {inputFocused && <span className="text-[11px] text-[#B0BAC9] select-none hidden sm:block">⌘ Enter</span>}
            <button
              onClick={() => prompt.trim() && onCreateApp(prompt.trim())}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex-shrink-0"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
