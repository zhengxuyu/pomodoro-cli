import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { recordSession, getSessions, type Session } from '../src/storage.js';

describe('storage', () => {
  let dataDir: string;

  beforeEach(() => {
    dataDir = mkdtempSync(join(tmpdir(), 'pomodoro-test-'));
  });

  afterEach(() => {
    rmSync(dataDir, { recursive: true, force: true });
  });

  describe('recordSession', () => {
    it('creates history file if missing', () => {
      const session: Session = {
        date: '2026-04-07',
        completedAt: '2026-04-07T14:25:00.000Z',
        workMinutes: 25,
        breakMinutes: 5,
      };

      recordSession(session, dataDir);

      const raw = readFileSync(join(dataDir, 'history.json'), 'utf-8');
      const data = JSON.parse(raw);
      expect(data.version).toBe(1);
      expect(data.sessions).toHaveLength(1);
      expect(data.sessions[0]).toEqual(session);
    });

    it('appends to existing history file', () => {
      const session1: Session = {
        date: '2026-04-07',
        completedAt: '2026-04-07T14:25:00.000Z',
        workMinutes: 25,
        breakMinutes: 5,
      };
      const session2: Session = {
        date: '2026-04-07',
        completedAt: '2026-04-07T15:00:00.000Z',
        workMinutes: 25,
        breakMinutes: 5,
      };

      recordSession(session1, dataDir);
      recordSession(session2, dataDir);

      const raw = readFileSync(join(dataDir, 'history.json'), 'utf-8');
      const data = JSON.parse(raw);
      expect(data.sessions).toHaveLength(2);
      expect(data.sessions[1]).toEqual(session2);
    });
  });

  describe('getSessions', () => {
    it('returns empty array when file does not exist', () => {
      const sessions = getSessions(dataDir);
      expect(sessions).toEqual([]);
    });

    it('returns parsed sessions from existing file', () => {
      const session: Session = {
        date: '2026-04-07',
        completedAt: '2026-04-07T14:25:00.000Z',
        workMinutes: 25,
        breakMinutes: 5,
      };
      recordSession(session, dataDir);

      const sessions = getSessions(dataDir);
      expect(sessions).toHaveLength(1);
      expect(sessions[0]).toEqual(session);
    });
  });
});
