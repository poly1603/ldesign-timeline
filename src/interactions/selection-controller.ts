/**
 * Selection Controller
 */

import { TimelineInstance, SelectionConfig, Controller } from '../types';

export class SelectionController implements Controller {
  private instance: TimelineInstance | null = null;
  private element: HTMLElement | null = null;
  private config: SelectionConfig;
  private cleanupFns: Array<() => void> = [];

  constructor(config: SelectionConfig = {}) {
    this.config = { enabled: true, multi: false, box: false, keyboard: true, ...config };
  }

  init(element: HTMLElement, instance: TimelineInstance): void {
    this.element = element;
    this.instance = instance;
    if (!this.config.enabled) return;
    // Selection implementation would go here
  }

  destroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}

