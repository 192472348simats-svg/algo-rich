"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/courses", label: "Courses", icon: "📚" },
  { href: "/dashboard/practice", label: "Practice", icon: "⚡" },
  { href: "/dashboard/cards", label: "Cards", icon: "🃏" },
  { href: "/dashboard/progress", label: "Progress", icon: "📊" },
];

/** Fixed bottom navigation bar for mobile screens */
export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-[44px] transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/70"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
