import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  icon?: LucideIcon;
  trend?: string;
  bgColor?: string;
  iconColor?: string;
}

export default function StatsCard({ title, icon: Icon, trend, bgColor, iconColor }: StatsCardProps) {
  return (
    <div
      className="text-black p-4 rounded-2xl flex flex-col shadow-[0_4px_16px_rgba(15,23,42,0.06)] tabular-nums h-[140px] sm:h-[152px]"
      style={{ backgroundColor: bgColor }}
    >
      {/* Título e ícone no mesmo flex row: em card estreito, "Calendário" é uma
          palavra só e passava por baixo do ícone quando ele era absolute. */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 truncate text-sm sm:text-base font-semibold leading-tight text-[#0B0F15]">
          {title}
        </h3>
        {Icon && (
          <Icon
            className="shrink-0 w-6 h-6 sm:w-7 sm:h-7"
            style={{ color: iconColor, strokeWidth: "2px" }}
          />
        )}
      </div>

      {trend && (
        <p className="mt-2 text-xs sm:text-sm font-medium leading-tight text-[#6A7686] truncate">
          {trend}
        </p>
      )}
    </div>
  );
}
