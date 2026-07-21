import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value?: number;
  icon?: LucideIcon;
  trend?: string;
  bgColor?: string;
  iconColor?: string;
}

export default function StatsCard({ title, icon: Icon, trend, bgColor, iconColor }: StatsCardProps) {
  return (
    <div
      className="text-black p-4 rounded-2xl relative flex flex-col shadow-[0_4px_16px_rgba(15,23,42,0.06)] tabular-nums h-[140px] sm:h-[152px]"
      style={{ backgroundColor: bgColor }}
    >
      {Icon && (
        <Icon
          className="absolute top-3 right-3 w-6 h-6 sm:w-7 sm:h-7"
          style={{ color: iconColor, strokeWidth: "2px" }}
        />
      )}
      <h3 className="text-sm sm:text-base font-semibold leading-tight text-[#0B0F15] mr-8">
        {title}
      </h3>

      {trend && (
        <p className="mt-2 text-xs sm:text-sm font-medium leading-tight text-[#6A7686] truncate">
          {trend}
        </p>
      )}
    </div>
  );
}
