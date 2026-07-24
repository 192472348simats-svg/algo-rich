import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Sidebar from "./components/Sidebar";
import MobileNav from "@/app/components/ui/MobileNav";
import PageTransition from "./components/PageTransition";
import StreakUrgencyBanner from "./components/StreakUrgencyBanner";
import Zyra from "@/app/components/Zyra";
import { computeStreak } from "@/lib/streakUtils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const isAdmin = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim()).includes(session.user.email || "");

  // Fetch current phase and streak data for sidebar + banner
  // Wrapped in try/catch so the dashboard still renders if DB is unreachable
  let user: { currentPhase: number } | null = null;
  let currentStreak = 0;
  let practicedToday = false;

  try {
    const [fetchedUser, recentProgress, recentSubmissions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { currentPhase: true },
      }),
      prisma.progress.findMany({
        where: { userId: session.user.id, completed: true, completedAt: { not: null } },
        select: { completedAt: true },
        orderBy: { completedAt: "desc" },
        take: 120,
      }),
      prisma.submission.findMany({
        where: { userId: session.user.id },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 120,
      }),
    ]);

    user = fetchedUser;

    // Compute streak for urgency banner
    const activityDates: string[] = [];
    for (const p of recentProgress) {
      if (p.completedAt) activityDates.push(p.completedAt.toISOString().slice(0, 10));
    }
    for (const s of recentSubmissions) {
      activityDates.push(s.createdAt.toISOString().slice(0, 10));
    }
    ({ currentStreak, practicedToday } = computeStreak(activityDates));
  } catch (err) {
    // DB unreachable (e.g. Atlas IP not whitelisted) — render with safe defaults
    console.warn("[DashboardLayout] DB unavailable; using safe defaults.", err instanceof Error ? err.message : err);
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        userName={session.user.name || "User"}
        userEmail={session.user.email || ""}
        currentPhase={user?.currentPhase ?? 1}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <div className="min-h-screen dashboard-bg grid-bg relative overflow-hidden">
          {/* Ambient depth blobs */}
          <div
            className="ambient-blob"
            style={{
              top: "-80px",
              right: "-60px",
              width: "320px",
              height: "320px",
              background: "radial-gradient(circle, hsl(43 96% 56% / 0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
              ["--drift-duration" as string]: "28s",
            }}
          />
          <div
            className="ambient-blob"
            style={{
              bottom: "10%",
              left: "5%",
              width: "260px",
              height: "260px",
              background: "radial-gradient(circle, hsl(220 80% 65% / 0.06) 0%, transparent 70%)",
              filter: "blur(50px)",
              ["--drift-duration" as string]: "34s",
              animationDelay: "-8s",
            }}
          />
          <div
            className="ambient-blob"
            style={{
              top: "40%",
              left: "40%",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, hsl(43 96% 56% / 0.04) 0%, transparent 70%)",
              filter: "blur(40px)",
              ["--drift-duration" as string]: "22s",
              animationDelay: "-15s",
            }}
          />
          {/* Noise texture overlay */}
          <div
            className="pointer-events-none fixed inset-0 z-[1]"
            style={{
              opacity: 0.018,
              mixBlendMode: "overlay",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
          />
          <div className="relative z-[2] p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
            <StreakUrgencyBanner
              currentStreak={currentStreak}
              practicedToday={practicedToday}
            />
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Zyra — always visible inside dashboard */}
      <Zyra context="dashboard" />
    </div>
  );
}
