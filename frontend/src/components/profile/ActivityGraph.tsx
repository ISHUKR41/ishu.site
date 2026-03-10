/**
 * ActivityGraph.tsx — GitHub-Style Contribution Heatmap
 * 
 * Shows REAL activity data from user's tool usage history.
 * If no data is provided, shows an empty grid (NOT sample/demo data).
 * 
 * Props:
 * - data: Record<string, number> — e.g. { "2026-03-11": 5 }
 *   This is computed from user.toolHistory in the parent component.
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface ActivityGraphProps {
  data?: Record<string, number>; // Real data from toolHistory — { "YYYY-MM-DD": count }
}

// Color levels for activity intensity (blue theme)
const getColor = (count: number): string => {
  if (count === 0) return "rgba(255,255,255,0.03)";
  if (count <= 1) return "hsl(217, 91%, 45%, 0.35)";
  if (count <= 2) return "hsl(217, 91%, 50%, 0.50)";
  if (count <= 3) return "hsl(217, 91%, 55%, 0.65)";
  return "hsl(217, 91%, 60%, 0.85)";
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

const CELL_SIZE = 13;
const CELL_GAP = 3;
const CELL_TOTAL = CELL_SIZE + CELL_GAP;

const ActivityGraph = ({ data: activityData }: ActivityGraphProps) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

  // Build the grid data (52 weeks × 7 days) using REAL data (or empty)
  const { weeks, monthLabels, totalActivities } = useMemo(() => {
    const realData = activityData || {}; // No demo data — just use empty if none
    const today = new Date();
    const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let totalActivities = 0;

    const start = new Date(today);
    start.setDate(start.getDate() - 364 - start.getDay());

    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < 371; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      if (date > today) break;
      
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split("T")[0];
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: weeks.length });
        lastMonth = month;
      }

      const count = realData[dateStr] || 0;
      totalActivities += count;
      currentWeek.push({ date: dateStr, count, dayOfWeek });
    }

    if (currentWeek.length > 0) weeks.push(currentWeek);
    return { weeks, monthLabels, totalActivities };
  }, [activityData]);

  const svgWidth = weeks.length * CELL_TOTAL + 36;
  const svgHeight = 7 * CELL_TOTAL + 24;

  return (
    <div className="relative">
      {/* Total count */}
      <div className="text-xs text-white/30 mb-3">
        {totalActivities > 0
          ? `${totalActivities} activities in the last year`
          : "No activity recorded yet — start using tools to see your graph fill up!"}
      </div>

      <div className="overflow-x-auto pb-2">
        <svg width={svgWidth} height={svgHeight} className="select-none">
          {/* Month labels */}
          {monthLabels.map(({ label, col }, i) => (
            <text key={i} x={col * CELL_TOTAL + 36} y={10} className="fill-white/30 text-[10px]" fontFamily="Inter, system-ui, sans-serif">
              {label}
            </text>
          ))}

          {/* Day labels */}
          {DAYS.map((day, i) => (
            day && <text key={i} x={0} y={i * CELL_TOTAL + 30} className="fill-white/25 text-[9px]" fontFamily="Inter, system-ui, sans-serif">{day}</text>
          ))}

          {/* Activity cells */}
          {weeks.map((week, weekIdx) =>
            week.map((day) => (
              <motion.rect
                key={day.date}
                x={weekIdx * CELL_TOTAL + 36}
                y={day.dayOfWeek * CELL_TOTAL + 18}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={3} ry={3}
                fill={getColor(day.count)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: weekIdx * 0.003, duration: 0.15 }}
                className="cursor-pointer transition-all duration-150 hover:brightness-125"
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGRectElement).getBoundingClientRect();
                  setTooltip({ x: rect.left, y: rect.top - 40, date: day.date, count: day.count });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))
          )}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 rounded-lg border border-white/10 bg-[hsl(225,50%,10%)] px-3 py-2 text-xs text-white shadow-xl pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <span className="font-medium">{tooltip.count} {tooltip.count === 1 ? "activity" : "activities"}</span>
          <span className="text-white/40 ml-2">{new Date(tooltip.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-white/30">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: getColor(level) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityGraph;
