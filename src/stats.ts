import type { Session } from './storage.js';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const BLOCK = '\u2588';

export interface DayStats {
  label: string;
  date: string;
  count: number;
}

export interface WeeklyStats {
  weekStart: string;
  days: DayStats[];
  total: number;
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getMonday(ref: Date): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

export function getWeeklyStats(sessions: Session[], referenceDate: Date = new Date()): WeeklyStats {
  const monday = getMonday(referenceDate);
  const weekStart = toDateString(monday);

  const days: DayStats[] = DAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return { label, date: toDateString(d), count: 0 };
  });

  const dateToIndex = new Map(days.map((d, i) => [d.date, i]));

  for (const session of sessions) {
    const idx = dateToIndex.get(session.date);
    if (idx !== undefined) {
      days[idx].count++;
    }
  }

  const total = days.reduce((sum, d) => sum + d.count, 0);

  return { weekStart, days, total };
}

export function formatStats(stats: WeeklyStats): string {
  const lines: string[] = [];

  // Header
  const weekDate = new Date(stats.weekStart + 'T00:00:00');
  const monthName = weekDate.toLocaleString('en-US', { month: 'short' });
  const day = weekDate.getDate();
  const year = weekDate.getFullYear();
  lines.push(`Pomodoro Stats - Week of ${monthName} ${day}, ${year}`);
  lines.push('');

  // Day bars
  for (const d of stats.days) {
    if (d.count === 0) {
      lines.push(`  ${d.label}  (none)`);
    } else {
      const bar = BLOCK.repeat(d.count * 2);
      lines.push(`  ${d.label}  ${bar}  ${d.count}`);
    }
  }

  lines.push('  ' + '\u2500'.repeat(20));
  lines.push(`  Total: ${stats.total} pomodoros`);

  return lines.join('\n');
}
