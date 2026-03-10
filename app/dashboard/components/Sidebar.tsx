"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Code,
  Eye,
  GitBranch,
  BarChart2,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Brain,
  Map,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badgeKey?: "review" | "cards";
  minPhase?: number; // Minimum phase required to show this item
}

interface NavGroup {
  label: string | null;
  items: NavItem[];
}

interface SidebarProps {
  userName: string;
  userEmail: string;
  currentPhase?: number;
}

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { href: "/dashboard/path", label: "Learning Path", icon: <Map size={18} /> },
    ],
  },
  {
    label: "LEARN",
    items: [
      { href: "/dashboard/courses", label: "Courses", icon: <BookOpen size={18} /> },
      { href: "/dashboard/sessions", label: "Sessions", icon: <Layers size={18} /> },
      { href: "/dashboard/cards", label: "Daily Cards", icon: <Layers size={18} />, badgeKey: "cards" as const, minPhase: 2 },
      { href: "/dashboard/visualize", label: "Visualizer", icon: <Eye size={18} /> },
    ],
  },
  {
    label: "PRACTICE",
    items: [
      { href: "/dashboard/practice", label: "Problems", icon: <Code size={18} /> },
      { href: "/dashboard/review", label: "Review", icon: <Brain size={18} />, badgeKey: "review" as const, minPhase: 2 },
      { href: "/dashboard/patterns", label: "Patterns", icon: <GitBranch size={18} />, minPhase: 3 },
    ],
  },
  {
    label: "TRACK",
    items: [
      { href: "/dashboard/progress", label: "Progress", icon: <BarChart2 size={18} /> },
      { href: "/dashboard/achievements", label: "Achievements", icon: <Award size={18} />, minPhase: 3 },
    ],
  },
];

/** Fetches live badge counts for Review and Daily Cards */
function useBadgeCounts() {
  const [counts, setCounts] = useState<{ review: number; cards: number }>({ review: 0, cards: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [reviewRes, cardsRes] = await Promise.all([
          fetch("/api/reviews").catch(() => null),
          fetch("/api/cards/daily").catch(() => null),
        ]);
        let review = 0;
        let cards = 0;
        if (reviewRes?.ok) {
          const data = await reviewRes.json();
          review = data.stats?.dueNow ?? 0;
        }
        if (cardsRes?.ok) {
          const data = await cardsRes.json();
          cards = data.cards?.length ?? 0;
        }
        setCounts({ review, cards });
      } catch { /* silently fail */ }
    }
    load();
  }, []);

  return counts;
}

export default function Sidebar({ userName, userEmail, currentPhase = 1 }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const badgeCounts = useBadgeCounts();

  // Filter nav items by minimum phase requirement
  const filteredNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.minPhase || (currentPhase ?? 1) >= item.minPhase
      ),
    }))
    .filter((group) => group.items.length > 0);

  const initial = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-navy-dark border border-gold-primary/30 rounded-lg text-gold-primary"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-60 glass-strong flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[hsl(228_30%_22%/0.5)]">
          <Link href="/" className="block">
            <h1 className="text-xl font-bold gradient-text text-glow logo-breathe">Algo Rich</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 tracking-[0.1em] uppercase font-bold">
              LEARNING PLATFORM
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          {filteredNavGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-5" : ""}>
              {group.label && (
                <div className="px-3 mb-2">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-bold">
                    {group.label}
                  </p>
                  <span
                    className="block mt-1 rounded-full"
                    style={{ width: "28px", height: "1px", background: "hsl(43 96% 56% / 0.45)" }}
                  />
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <motion.div
                        whileHover={{ x: 3 }}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-white/50 hover:text-white/80 hover:bg-primary/5"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                        <div className="relative w-[18px] flex-shrink-0">
                          {item.icon}
                          {item.badgeKey && badgeCounts[item.badgeKey] > 0 && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                              {badgeCounts[item.badgeKey] > 9 ? '9+' : badgeCounts[item.badgeKey]}
                            </span>
                          )}
                        </div>
                        <span>{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Settings — separate at bottom of nav */}
          <div className="mt-5 pt-4 border-t border-[hsl(228_30%_22%/0.5)]">
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                whileHover={{ x: 3 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === "/dashboard/settings"
                    ? "bg-primary/10 text-primary"
                    : "text-white/50 hover:text-white/80 hover:bg-primary/5"
                }`}
              >
                {pathname === "/dashboard/settings" && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <span className="w-[18px] flex-shrink-0"><Settings size={18} /></span>
                <span>Settings</span>
              </motion.div>
            </Link>
          </div>
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-[hsl(228_30%_22%/0.5)]">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center text-primary-foreground text-xs font-bold">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-white/40 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
