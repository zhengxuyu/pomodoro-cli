import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startTimer } from '../src/timer.js';

describe('timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onTick with correct remaining seconds', () => {
    const onTick = vi.fn();
    const onComplete = vi.fn();

    startTimer(3, { onTick, onComplete });

    // Initial tick at t=0
    expect(onTick).toHaveBeenCalledWith(3);

    vi.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledWith(2);

    vi.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledWith(1);
  });

  it('calls onComplete when time expires', () => {
    const onTick = vi.fn();
    const onComplete = vi.fn();

    startTimer(2, { onTick, onComplete });

    vi.advanceTimersByTime(2000);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('does not call onTick after completion', () => {
    const onTick = vi.fn();
    const onComplete = vi.fn();

    startTimer(1, { onTick, onComplete });
    onTick.mockClear();

    vi.advanceTimersByTime(1000); // completes here
    onTick.mockClear();

    vi.advanceTimersByTime(1000); // should not tick
    expect(onTick).not.toHaveBeenCalled();
  });

  it('stop() halts the timer', () => {
    const onTick = vi.fn();
    const onComplete = vi.fn();

    const handle = startTimer(5, { onTick, onComplete });
    handle.stop();

    onTick.mockClear();
    vi.advanceTimersByTime(5000);

    expect(onTick).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
