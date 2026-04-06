export function renderCountdown(remainingSeconds: number, label: string): void {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const time = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  process.stdout.write(`\r  ${label}: ${time} `);
}

export function clearLine(): void {
  process.stdout.write('\r\x1b[K');
}
