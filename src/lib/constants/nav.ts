import { LayoutDashboard, Wand2, Lightbulb, FlaskConical, TrendingUp, CalendarClock, History, Settings } from "lucide-react";

export const appNav = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/generator", key: "generator", icon: Wand2 },
  { href: "/ideas", key: "ideas", icon: Lightbulb },
  { href: "/atm", key: "atm", icon: FlaskConical },
  { href: "/viral", key: "viral", icon: TrendingUp },
  { href: "/calendar", key: "calendar", icon: CalendarClock },
  { href: "/history", key: "history", icon: History },
  { href: "/settings", key: "settings", icon: Settings }
] as const;
