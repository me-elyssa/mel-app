"use client";

import { Menu } from "lucide-react";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-[#E6EAF0]">
      <span className="text-lg font-extrabold text-[#0B0F15]">Mel</span>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-[12px] hover:bg-[#F3F5F9] text-[#0B0F15]"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
