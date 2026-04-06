import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface Session {
  date: string;
  completedAt: string;
  workMinutes: number;
  breakMinutes: number;
}

interface HistoryData {
  version: number;
  sessions: Session[];
}

const HISTORY_FILE = 'history.json';

function defaultDataDir(): string {
  return join(homedir(), '.pomodoro');
}

function historyPath(dataDir: string): string {
  return join(dataDir, HISTORY_FILE);
}

function readHistory(dataDir: string): HistoryData {
  const filePath = historyPath(dataDir);
  if (!existsSync(filePath)) {
    return { version: 1, sessions: [] };
  }
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as HistoryData;
}

function writeHistory(data: HistoryData, dataDir: string): void {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(historyPath(dataDir), JSON.stringify(data, null, 2));
}

export function recordSession(session: Session, dataDir: string = defaultDataDir()): void {
  const data = readHistory(dataDir);
  data.sessions.push(session);
  writeHistory(data, dataDir);
}

export function getSessions(dataDir: string = defaultDataDir()): Session[] {
  return readHistory(dataDir).sessions;
}
