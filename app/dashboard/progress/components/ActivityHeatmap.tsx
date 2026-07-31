"use client";

import { motion } from "framer-motion";

interface ActivityDay { date: string; count: number; }

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function colorFor(count: number) {
  if (count >= 5) return "#f59e0b";
  if (count >= 3) return "rgba(245,158,11,0.55)";
  if (count >= 1) return "#334155";
  return "#1e293b";
}

export default function ActivityHeatmap({ activityData }: { activityData: ActivityDay[] }) {
  const counts = new Map(activityData.map((day) => [day.date, day.count]));
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 179);
  start.setDate(start.getDate() - start.getDay());
  const weeks: ActivityDay[][] = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 7)) {
    const week: ActivityDay[] = [];
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() + offset);
      const dateKey = dayKey(date);
      week.push({ date: dateKey, count: counts.get(dateKey) ?? 0 });
    }
    weeks.push(week);
  }

  return (
    <div className="overflow-x-auto pb-2" aria-label="180 day activity heatmap">
      <div className="inline-flex gap-[3px] min-w-max">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(weekIndex * 0.01, 0.8) }}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: colorFor(day.count) }}
                title={`${day.date}: ${day.count} ${day.count === 1 ? "activity" : "activities"}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-white/40">
        <span>Less</span><i className="w-3 h-3 rounded-sm bg-[#1e293b]" /><i className="w-3 h-3 rounded-sm bg-[#334155]" /><i className="w-3 h-3 rounded-sm bg-amber-500/50" /><i className="w-3 h-3 rounded-sm bg-amber-500" /><span>More</span>
      </div>
    </div>
  );
}
