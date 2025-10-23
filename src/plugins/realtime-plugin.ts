/**
 * Realtime Plugin
 */

import { TimelineInstance, Plugin, RealtimeConfig } from '../types';

export class RealtimePlugin implements Plugin {
  name = 'realtime';
  version = '1.0.0';
  private instance: TimelineInstance | null = null;
  private config: RealtimeConfig;
  private ws: WebSocket | null = null;

  constructor(config: RealtimeConfig = {}) {
    this.config = { enabled: false, ...config };
  }

  install(instance: TimelineInstance): void {
    this.instance = instance;
    if (this.config.enabled && this.config.url) {
      this.connect();
    }
  }

  private connect(): void {
    if (!this.config.url) return;
    this.ws = new WebSocket(this.config.url);
    this.ws.onmessage = (event) => {
      // Handle realtime updates
      console.info('Realtime data:', event.data);
    };
  }

  uninstall(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.instance = null;
  }
}

