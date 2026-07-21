"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden md:flex w-[240px] flex-shrink-0 flex-col bg-[var(--sidebar-bg)] border-r border-[#E6EAF0] p-3">
        <SidebarNav />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="fixed inset-y-0 left-0 w-[260px] bg-[var(--sidebar-bg)] z-50 p-3 md:hidden"
              >
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-[12px] hover:bg-[#E6EAF0] text-[#0B0F15]"
                    aria-label="Fechar menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SidebarNav onNavigate={() => setDrawerOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
