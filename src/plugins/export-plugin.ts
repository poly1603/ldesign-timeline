/**
 * Export Plugin
 */

import { TimelineInstance, Plugin, ExportConfig } from '../types';

export class ExportPlugin implements Plugin {
  name = 'export';
  version = '1.0.0';
  private instance: TimelineInstance | null = null;

  install(instance: TimelineInstance): void {
    this.instance = instance;
  }

  async exportAs(config: ExportConfig): Promise<Blob | string> {
    if (!this.instance) throw new Error('Plugin not installed');
    return this.instance.export(config);
  }

  uninstall(): void {
    this.instance = null;
  }
}

