import { execFile } from 'child_process';

export function playSound(): void {
  execFile('afplay', ['/System/Library/Sounds/Glass.aiff'], () => {
    // Silently ignore errors (e.g., sound file missing, not macOS)
  });
}
