import { LayoutDashboard, BookOpen, Brain, User, CalendarDays, Gavel } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  { href: "/nucleos", label: "Núcleos", icon: Brain },
  { href: "/pessoal", label: "Pessoal", icon: User },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/edcm", label: "Cronograma EDCM", icon: Gavel },
] as const;
