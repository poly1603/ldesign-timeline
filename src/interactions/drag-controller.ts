/**
 * Drag Controller - Node dragging
 */

import { TimelineInstance, TimelineEvent, DragConfig, Controller } from '../types';

export class DragController implements Controller {
  private instance: TimelineInstance | null = null;
  private element: HTMLElement | null = null;
  private config: DragConfig;
  private cleanupFns: Array<() => void> = [];

  constructor(config: DragConfig = {}) {
    this.config = { enabled: false, snap: false, snapInterval: 60000, preview: true, ...config };
  }

  init(element: HTMLElement, instance: TimelineInstance): void {
    this.element = element;
    this.instance = instance;
    if (!this.config.enabled) return;
    // Drag implementation would go here
  }

  destroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}

