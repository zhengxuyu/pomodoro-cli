# pomodoro-cli

A minimal terminal Pomodoro timer. Track your focus sessions and view weekly stats, all from the command line.

## Features

- Real-time countdown display in the terminal
- Configurable work and break durations
- System sound notification when a phase ends (macOS)
- Automatic session logging to `~/.pomodoro/history.json`
- Weekly stats with visual bar chart

## Install

```bash
git clone https://github.com/zhengxuyu/pomodoro-cli.git
cd pomodoro-cli
npm install
```

## Usage

### Start a Pomodoro

```bash
# Default: 25 min work + 5 min break
npm start

# Custom durations
npm start -- --work 50 --break 10
```

The timer counts down in real time and plays a sound when each phase ends. Press `Ctrl+C` to cancel at any time.

```
Pomodoro: 25min work / 5min break

  Work: 24:37
```

When the work phase finishes, the session is automatically saved and the break timer starts.

### View weekly stats

```bash
npm start -- stats
```

```
Pomodoro Stats - Week of Apr 7, 2026

  Mon  ████████  4
  Tue  ██████    3
  Wed  ██████████  5
  Thu  ████      2
  Fri  (none)
  Sat  ██        1
  Sun  (none)
  ────────────────────
  Total: 15 pomodoros
```

## CLI Reference

| Command / Flag | Description | Default |
|---|---|---|
| `start` | Start a Pomodoro session (default command) | |
| `--work <minutes>` | Work phase duration | `25` |
| `--break <minutes>` | Break phase duration | `5` |
| `stats` | Show this week's statistics | |
| `-V, --version` | Print version | |
| `-h, --help` | Print help | |

## Data Storage

Completed sessions are stored in `~/.pomodoro/history.json`:

```json
{
  "version": 1,
  "sessions": [
    {
      "date": "2026-04-07",
      "completedAt": "2026-04-07T14:25:00.000Z",
      "workMinutes": 25,
      "breakMinutes": 5
    }
  ]
}
```

Only completed work sessions are recorded. Cancelled sessions are not saved.

## Development

```bash
# Run tests
npm test

# Type check
npm run typecheck
```

## Project Structure

```
src/
  index.ts      CLI entry point
  timer.ts      Countdown logic
  display.ts    Terminal rendering
  sound.ts      System sound playback (macOS afplay)
  storage.ts    Session persistence
  stats.ts      Weekly aggregation and formatting
tests/
  timer.test.ts
  storage.test.ts
  stats.test.ts
```

## Requirements

- Node.js >= 18
- macOS (for sound notifications; timer and stats work on any platform)

## License

MIT
