export interface TimerCallbacks {
  onTick(remainingSeconds: number): void;
  onComplete(): void;
}

export interface TimerHandle {
  stop(): void;
}

export function startTimer(
  durationSeconds: number,
  callbacks: TimerCallbacks,
): TimerHandle {
  let remaining = durationSeconds;

  callbacks.onTick(remaining);

  const intervalId = setInterval(() => {
    remaining--;

    if (remaining <= 0) {
      clearInterval(intervalId);
      callbacks.onComplete();
      return;
    }

    callbacks.onTick(remaining);
  }, 1000);

  return {
    stop() {
      clearInterval(intervalId);
    },
  };
}
