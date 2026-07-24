"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Code, Layers, Brain, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true, badgeKey: null },
  { href: "/dashboard/practice", label: "Problems", icon: Code, exact: false, badgeKey: null },
  { href: "/dashboard/sessions", label: "Sessions", icon: Layers, exact: false, badgeKey: null },
  { href: "/dashboard/review", label: "Review", icon: Brain, exact: false, badgeKey: "review" as const },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart2, exact: false, badgeKey: null },
];

function useLiveBadge() {
  const [reviewCount, setReviewCount] = useState(0);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.stats?.dueNow) setReviewCount(data.stats.dueNow);
      })
      .catch(() => {});
  }, []);
  return { review: reviewCount };
}

/** Fixed bottom navigation bar for mobile screens */
export default function MobileNav() {
  const pathname = usePathname();
  const badges = useLiveBadge();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: "hsl(228 35% 8% / 0.96)",
        borderColor: "hsl(228 30% 22% / 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch h-[60px]">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const badge = item.badgeKey ? badges[item.badgeKey] ?? 0 : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center relative"
            >
              <motion.div
                whileTap={{ scale: 0.80 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex flex-col items-center justify-center gap-[3px] w-full h-full"
              >
                {/* Top active bar */}
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-white/35"
                    }`}
                  />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-white/30"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
