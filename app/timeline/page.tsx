"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

const BRAND_COLORS: [string, string][] = [
  ["#6366f1", "#818cf8"],
  ["#8b5cf6", "#a78bfa"],
  ["#ec4899", "#f472b6"],
  ["#ef4444", "#f87171"],
  ["#f97316", "#fb923c"],
  ["#f59e0b", "#fbbf24"],
  ["#84cc16", "#a3e635"],
  ["#22c55e", "#4ade80"],
  ["#14b8a6", "#2dd4bf"],
  ["#06b6d4", "#22d3ee"],
  ["#0ea5e9", "#38bdf8"],
  ["#3b82f6", "#60a5fa"],
  ["#d946ef", "#e879f9"],
  ["#e11d48", "#fb7185"],
  ["#0d9488", "#2dd4bf"],
  ["#7c3aed", "#a78bfa"],
  ["#2563eb", "#60a5fa"],
  ["#c026d3", "#e879f9"],
  ["#ea580c", "#fb923c"],
  ["#16a34a", "#4ade80"],
  ["#0891b2", "#22d3ee"],
  ["#4f46e5", "#818cf8"],
  ["#9333ea", "#c084fc"],
  ["#dc2626", "#f87171"],
  ["#ca8a04", "#facc15"],
  ["#059669", "#34d399"],
];

function getBrandColor(index: number): [string, string] {
  return BRAND_COLORS[index % BRAND_COLORS.length];
}

const ROW_HEIGHT = 44;
const LABEL_WIDTH = 240;

type MonthCol = { year: number; month: number; label: string };

function getMonthsBetween(start: Date, end: Date): MonthCol[] {
  const months: MonthCol[] = [];
  const d = new Date(start.getFullYear(), start.getMonth(), 1);
  while (d <= end) {
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString("en-US", { month: "short" }),
    });
    d.setMonth(d.getMonth() + 1);
  }
  return months;
}

function getYearSpans(months: MonthCol[]) {
  const spans: { year: number; count: number }[] = [];
  for (const m of months) {
    if (spans.length > 0 && spans[spans.length - 1].year === m.year) {
      spans[spans.length - 1].count++;
    } else {
      spans.push({ year: m.year, count: 1 });
    }
  }
  return spans;
}

function dayOffset(date: Date, origin: Date): number {
  return (date.getTime() - origin.getTime()) / (1000 * 60 * 60 * 24);
}

export default function TimelinePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeYear, setActiveYear] = useState<number | "all">("all");
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    function measure() {
      if (wrapRef.current) {
        setContainerWidth(wrapRef.current.offsetWidth);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {});
  }, []);

  // Filter projects with dates, keep same order as homepage (created_at)
  const allTimed = projects.filter((p) => p.startDate);

  if (allTimed.length === 0) {
    return (
      <div className="mx-auto max-w-[1220px] px-6 py-8 text-center">
        <p className="text-muted-foreground">No projects with dates to display.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-primary underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  // Collect all unique years across project dates
  const allYears = Array.from(
    new Set(
      allTimed.flatMap((p) => {
        const years = [new Date(p.startDate + "T00:00:00").getFullYear()];
        if (p.endDate) years.push(new Date(p.endDate + "T00:00:00").getFullYear());
        if (p.launchDate) years.push(new Date(p.launchDate + "T00:00:00").getFullYear());
        return years;
      })
    )
  ).sort();

  // Compute range based on active year
  let rangeStart: Date;
  let rangeEnd: Date;

  if (activeYear === "all") {
    rangeStart = new Date(2026, 1, 1);  // Feb 2026
    rangeEnd = new Date(2027, 2, 31);   // Mar 2027
  } else {
    rangeStart = new Date(activeYear, 0, 1);
    rangeEnd = new Date(activeYear, 11, 31);
  }

  // Filter projects that overlap with visible range
  const timed = allTimed.filter((p) => {
    const start = new Date(p.startDate + "T00:00:00");
    const end = p.endDate
      ? new Date(p.endDate + "T00:00:00")
      : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
    const launch = p.launchDate ? new Date(p.launchDate + "T00:00:00") : null;
    const projectEnd = launch && launch > end ? launch : end;
    return projectEnd >= rangeStart && start <= rangeEnd;
  });

  const months = getMonthsBetween(rangeStart, rangeEnd);
  const yearSpans = getYearSpans(months);
  const totalDays = dayOffset(rangeEnd, rangeStart);
  const availableWidth = Math.max(containerWidth - LABEL_WIDTH - 2, 600);
  const monthWidth = Math.max(Math.floor(availableWidth / months.length), 50);
  const chartWidth = months.length * monthWidth;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOff = dayOffset(today, rangeStart);
  const todayX = (todayOff / totalDays) * chartWidth;
  const showToday = today >= rangeStart && today <= rangeEnd;

  // Build index map for consistent colors
  const indexMap = new Map<string, number>();
  projects.forEach((p, i) => indexMap.set(p.id, i));

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              Timeline
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight">Delivery Timeline</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {timed.length} projects
            </p>
            <div className="mt-3 flex gap-1.5">
              <button
                onClick={() => setActiveYear("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeYear === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All
              </button>
              {allYears.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeYear === y
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Dashboard
          </Link>
        </header>

        {/* Timeline chart */}
        <div ref={wrapRef} className="rounded-xl border bg-card overflow-hidden">
          <div className="flex">
            {/* Fixed label column */}
            <div className="shrink-0 border-r bg-card z-10" style={{ width: LABEL_WIDTH }}>
              {/* Year header placeholder */}
              <div className="h-8 border-b" />
              {/* Month header placeholder */}
              <div className="h-8 border-b" />
              {/* Project labels */}
              {timed.map((p) => {
                const idx = indexMap.get(p.id) ?? 0;
                const [from] = getBrandColor(idx);
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-2.5 border-b px-4"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: from }}
                    />
                    <span className="truncate text-sm font-medium">{p.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Scrollable chart area */}
            <div ref={scrollRef} className="flex-1 overflow-hidden">
              <div style={{ width: chartWidth, minWidth: "100%" }}>
                {/* Year headers */}
                <div className="flex h-8 border-b">
                  {yearSpans.map((ys) => (
                    <div
                      key={ys.year}
                      className="flex items-center justify-center text-xs font-bold text-muted-foreground"
                      style={{ width: ys.count * monthWidth }}
                    >
                      {ys.year}
                    </div>
                  ))}
                </div>

                {/* Month headers */}
                <div className="flex h-8 border-b">
                  {months.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center text-xs text-muted-foreground border-l first:border-l-0"
                      style={{ width: monthWidth }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                <div className="relative">
                  {/* Month grid lines */}
                  <div className="absolute inset-0 flex pointer-events-none" aria-hidden>
                    {months.map((_, i) => (
                      <div
                        key={i}
                        className="border-l border-border/40 first:border-l-0"
                        style={{ width: monthWidth, height: timed.length * ROW_HEIGHT }}
                      />
                    ))}
                  </div>

                  {/* Today line */}
                  {showToday && (
                    <div
                      className="absolute top-0 z-20 w-px"
                      style={{
                        left: todayX,
                        height: timed.length * ROW_HEIGHT,
                        background: "#ef4444",
                      }}
                    >
                      <div className="absolute -top-0 -translate-x-1/2 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
                        Today
                      </div>
                    </div>
                  )}

                  {/* Project bars */}
                  {timed.map((p, rowIndex) => {
                    const idx = indexMap.get(p.id) ?? 0;
                    const [from, to] = getBrandColor(idx);
                    const start = new Date(p.startDate + "T00:00:00");
                    const end = p.endDate
                      ? new Date(p.endDate + "T00:00:00")
                      : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

                    const startOff = dayOffset(start, rangeStart);
                    const endOff = dayOffset(end, rangeStart);

                    const barLeft = (startOff / totalDays) * chartWidth;
                    const barWidth = Math.max(
                      ((endOff - startOff) / totalDays) * chartWidth,
                      40
                    );

                    // Launch date marker (only if within visible range)
                    const launchDate = p.launchDate
                      ? new Date(p.launchDate + "T00:00:00")
                      : null;
                    const launchInRange = launchDate && launchDate >= rangeStart && launchDate <= rangeEnd;
                    const launchX = launchInRange
                      ? (dayOffset(launchDate, rangeStart) / totalDays) * chartWidth
                      : null;

                    return (
                      <div
                        key={p.id}
                        className="relative border-b"
                        style={{ height: ROW_HEIGHT }}
                      >
                        {/* Bar */}
                        <div
                          className="absolute top-2 flex items-center rounded-full shadow-sm"
                          style={{
                            left: barLeft,
                            width: barWidth,
                            height: ROW_HEIGHT - 16,
                            background: `linear-gradient(90deg, ${from}, ${to})`,
                          }}
                        >
                          <span className="w-full text-center text-[11px] font-bold text-white drop-shadow-sm">
                            {p.progress}%
                          </span>
                        </div>

                        {/* Launch marker */}
                        {launchX !== null && (
                          <div
                            className="absolute top-1 -translate-x-1/2 flex flex-col items-center"
                            style={{ left: launchX }}
                          >
                            <div
                              className="rounded px-1 py-0.5 text-[9px] font-bold text-white leading-none whitespace-nowrap"
                              style={{ backgroundColor: from }}
                            >
                              Launch
                            </div>
                            <div className="h-5 w-px" style={{ backgroundColor: from }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300" />
            <span>Development period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="rounded bg-indigo-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Launch</div>
            <span>Launch date</span>
          </div>
          {showToday && (
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-px bg-red-500" />
              <span>Today</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
