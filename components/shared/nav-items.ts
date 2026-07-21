import { LayoutDashboard, BookOpen, Brain, User, CalendarDays } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  { href: "/nucleos", label: "Núcleos", icon: Brain },
  { href: "/pessoal", label: "Pessoal", icon: User },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
] as const;
