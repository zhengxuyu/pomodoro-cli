import { describe, it, expect } from 'vitest';
import { getWeeklyStats, formatStats } from '../src/stats.js';
import type { Session } from '../src/storage.js';

describe('stats', () => {
  // Week of 2026-03-30 (Mon) to 2026-04-05 (Sun)
  const sessions: Session[] = [
    { date: '2026-03-30', completedAt: '2026-03-30T10:00:00.000Z', workMinutes: 25, breakMinutes: 5 },
    { date: '2026-03-30', completedAt: '2026-03-30T11:00:00.000Z', workMinutes: 25, breakMinutes: 5 },
    { date: '2026-03-31', completedAt: '2026-03-31T10:00:00.000Z', workMinutes: 25, breakMinutes: 5 },
    { date: '2026-04-02', completedAt: '2026-04-02T10:00:00.000Z', workMinutes: 25, breakMinutes: 5 },
    { date: '2026-04-02', completedAt: '2026-04-02T11:00:00.000Z', workMinutes: 25, breakMinutes: 5 },
    { date: '2026-04-02', completedAt: '2026-04-02T12:00:00.000Z', workMinutes: 25, breakMinutes: 5 },
  ];

  describe('getWeeklyStats', () => {
    it('groups sessions by day of week', () => {
      // Reference date: 2026-04-02 (Thursday) — week is Mon Mar 30 – Sun Apr 5
      const stats = getWeeklyStats(sessions, new Date('2026-04-02'));

      expect(stats.days).toHaveLength(7);
      expect(stats.days[0]).toEqual({ label: 'Mon', date: '2026-03-30', count: 2 }); // Monday
      expect(stats.days[1]).toEqual({ label: 'Tue', date: '2026-03-31', count: 1 }); // Tuesday
      expect(stats.days[2]).toEqual({ label: 'Wed', date: '2026-04-01', count: 0 }); // Wednesday
      expect(stats.days[3]).toEqual({ label: 'Thu', date: '2026-04-02', count: 3 }); // Thursday
      expect(stats.total).toBe(6);
    });

    it('returns zeros for empty data', () => {
      const stats = getWeeklyStats([], new Date('2026-04-02'));

      expect(stats.days).toHaveLength(7);
      expect(stats.total).toBe(0);
      stats.days.forEach((day) => {
        expect(day.count).toBe(0);
      });
    });
  });

  describe('formatStats', () => {
    it('produces formatted output with bar chart', () => {
      const stats = getWeeklyStats(sessions, new Date('2026-04-02'));
      const output = formatStats(stats);

      expect(output).toContain('Mon');
      expect(output).toContain('████');
      expect(output).toContain('(none)');
      expect(output).toContain('Total: 6');
    });
  });
});
