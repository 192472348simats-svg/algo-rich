"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

interface PatternRadarProps {
  patterns: Array<{ name: string; progress: { problemsSolved: number } | null }>;
}

export default function PatternRadar({ patterns }: PatternRadarProps) {
  const data = patterns
    .filter((pattern) => pattern.progress && pattern.progress.problemsSolved > 0)
    .slice(0, 8)
    .map((pattern) => ({
      subject: pattern.name.length > 14 ? `${pattern.name.slice(0, 12)}…` : pattern.name,
      mastery: Math.min(100, (pattern.progress?.problemsSolved ?? 0) * 20),
      fullMark: 100,
    }));

  if (data.length < 3) return null;

  return (
    <div className="h-[320px] w-full" aria-label="Pattern mastery radar chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="68%">
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Mastery" dataKey="mastery" stroke="#F5A623" fill="#F5A623" fillOpacity={0.25} strokeWidth={2} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #475569", borderRadius: 8, color: "#f8fafc" }} formatter={(value) => [`${value}%`, "Mastery"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
