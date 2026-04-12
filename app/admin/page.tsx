import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSessionDefinition } from "@/lib/sessionDefinitions";
import { isAdminRequest } from "@/lib/isAdmin";

async function getStats() {
  // In a real server component, we fetch from the internal API or directly query the DB.
  // We'll fetch from the API to reuse the logic.
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/stats`, {
    cache: "no-store",
    headers: {
      // Pass cookies to maintain session for isAdminRequest in API
      Cookie: (await import("next/headers")).cookies().toString(),
    },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AdminDashboard() {
  const isAuthorized = await isAdminRequest();
  
  if (!isAuthorized) {
    redirect("/dashboard");
  }

  const data = await getStats();

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0f24] text-white flex items-center justify-center p-8">
        <p className="text-white/40">Failed to load admin stats. Check server logs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f24] text-white p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Founder Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">AlgoRich Platform Metrics (UTC)</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">
          LIVE DATA
        </div>
      </div>

      {/* Top Row: Core Growth */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={data.users.total} icon="👥" />
        <StatCard title="New (7d)" value={data.users.last7Days} icon="📈" />
        <StatCard title="Problems Solved" value={data.activity.totalSubmissions} icon="✅" />
        <StatCard title="Sessions Done" value={data.activity.totalSessionsCompleted} icon="🎓" />
      </div>

      {/* Second Row: Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total XP Distributed" value={data.activity.totalXPAwarded.toLocaleString()} icon="⭐" />
        <StatCard title="Active Today" value={data.activity.activeToday} icon="🔥" variant="accent" />
        <StatCard title="Unique Solvers" value={data.problems.uniqueSolvers} icon="🎯" />
      </div>

      {/* Third Row: Top Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-strong rounded-2xl p-6 border border-[#1E3A5F]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            🔥 Top Problems
          </h3>
          <div className="space-y-3">
            {data.problems.topProblems.map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-sm font-medium">{p.title}</span>
                <span className="text-xs text-[#E5A829] font-mono">{p.attempts} attempts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-[#1E3A5F]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            📂 Top Sessions
          </h3>
          <div className="space-y-3">
            {data.sessions.topSessions.map((s: any, i: number) => {
              const def = getSessionDefinition(s.slug);
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-sm font-medium">{def?.title || s.slug}</span>
                  <span className="text-xs text-[#E5A829] font-mono">{s.completions} completions</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Retention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          title="Active Streak (3+ Days)" 
          value={data.retention.usersWithStreak3Plus} 
          icon="🔥" 
          subtext="Approximate count of returning users"
        />
        <StatCard 
          title="Heavy Users (100+ XP)" 
          value={data.retention.usersWithXP100Plus} 
          icon="💪" 
          subtext="Users with significant engagement"
        />
      </div>

      {/* Footer */}
      <div className="text-center pt-8">
        <p className="text-[10px] text-white/10 uppercase tracking-widest">
          Secured for Founders only — Zero database write permissions on this page
        </p>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  variant = "default",
  subtext
}: { 
  title: string; 
  value: string | number; 
  icon: string;
  variant?: "default" | "accent";
  subtext?: string;
}) {
  return (
    <div className="glass-strong rounded-2xl p-6 border border-[#1E3A5F] hover:border-[#E5A829]/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xl">{icon}</span>
        {variant === "accent" && (
          <span className="w-2 h-2 rounded-full bg-[#E5A829] animate-pulse" />
        )}
      </div>
      <p className="text-3xl font-bold tabular-nums font-mono text-white group-hover:text-[#E5A829] transition-colors">
        {value}
      </p>
      <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mt-1">{title}</p>
      {subtext && <p className="text-[10px] text-white/20 mt-2 italic">{subtext}</p>}
    </div>
  );
}
