/**
 * Animation Engine
 */

import { AnimationFrame, EasingFunction } from '../types';
import { getEasing, requestFrame, cancelFrame } from '../utils';

export class AnimationEngine {
  private running: boolean = false;
  private startTime: number = 0;
  private animationId: number | null = null;
  private callbacks: Array<(frame: AnimationFrame) => void> = [];

  start(): void {
    if (this.running) return;
    this.running = true;
    this.startTime = Date.now();
    this.animate();
  }

  stop(): void {
    this.running = false;
    if (this.animationId !== null) {
      cancelFrame(this.animationId);
      this.animationId = null;
    }
  }

  onFrame(callback: (frame: AnimationFrame) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) this.callbacks.splice(index, 1);
    };
  }

  private animate(): void {
    if (!this.running) return;

    const now = Date.now();
    const elapsed = now - this.startTime;
    const frame: AnimationFrame = {
      time: elapsed,
      progress: 0,
      delta: 16,
      running: this.running,
    };

    this.callbacks.forEach(cb => cb(frame));
    this.animationId = requestFrame(() => this.animate());
  }
}

