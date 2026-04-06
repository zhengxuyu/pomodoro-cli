#!/usr/bin/env node
import { Command } from 'commander';
import { startTimer } from './timer.js';
import { renderCountdown, clearLine } from './display.js';
import { playSound } from './sound.js';
import { recordSession, getSessions } from './storage.js';
import { getWeeklyStats, formatStats } from './stats.js';

const program = new Command();

program
  .name('pomodoro')
  .description('A terminal Pomodoro timer')
  .version('0.1.0');

program
  .command('start', { isDefault: true })
  .description('Start a Pomodoro session')
  .option('--work <minutes>', 'Work duration in minutes', '25')
  .option('--break <minutes>', 'Break duration in minutes', '5')
  .action((opts) => {
    const workMinutes = parseFloat(opts.work);
    const breakMinutes = parseFloat(opts.break);

    if (isNaN(workMinutes) || workMinutes <= 0) {
      console.error('Error: --work must be a positive number');
      process.exit(1);
    }
    if (isNaN(breakMinutes) || breakMinutes <= 0) {
      console.error('Error: --break must be a positive number');
      process.exit(1);
    }

    console.log(`\nPomodoro: ${workMinutes}min work / ${breakMinutes}min break\n`);

    runPhase('Work', workMinutes, () => {
      playSound();
      clearLine();
      console.log('\nWork session complete!\n');

      // Record the completed pomodoro
      const now = new Date();
      recordSession({
        date: toDateString(now),
        completedAt: now.toISOString(),
        workMinutes,
        breakMinutes,
      });

      runPhase('Break', breakMinutes, () => {
        playSound();
        clearLine();
        console.log('\nBreak over! Ready for the next one.\n');
        process.exit(0);
      });
    });
  });

program
  .command('stats')
  .description('Show weekly Pomodoro statistics')
  .action(() => {
    const sessions = getSessions();
    const stats = getWeeklyStats(sessions);
    console.log('\n' + formatStats(stats) + '\n');
  });

function runPhase(label: string, minutes: number, onDone: () => void): void {
  const durationSeconds = Math.round(minutes * 60);

  const handle = startTimer(durationSeconds, {
    onTick: (remaining) => renderCountdown(remaining, label),
    onComplete: onDone,
  });

  process.on('SIGINT', () => {
    handle.stop();
    clearLine();
    console.log('\nPomodoro cancelled.\n');
    process.exit(0);
  });
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

program.parse();
