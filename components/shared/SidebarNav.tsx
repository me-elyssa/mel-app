"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      onNavigate?.();
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <nav className="flex flex-col gap-1">
      <div className="px-3 py-4 mb-2">
        <span className="text-lg font-extrabold text-[#0B0F15]">Mel</span>
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-colors",
              isActive
                ? "bg-[var(--neon)] text-[#0B0F15]"
                : "text-[#545F6C] hover:bg-[#E6EAF0]"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold text-[#545F6C] hover:bg-[#E6EAF0] transition-colors mt-4"
      >
        <LogOut className="w-5 h-5" />
        Sair
      </button>
    </nav>
  );
}
