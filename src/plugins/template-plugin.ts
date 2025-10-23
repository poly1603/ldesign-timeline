/**
 * Template Plugin
 */

import { TimelineInstance, Plugin, TemplateConfig, TimelineConfig } from '../types';

export class TemplatePlugin implements Plugin {
  name = 'template';
  version = '1.0.0';
  private instance: TimelineInstance | null = null;
  private templates: Record<string, Partial<TimelineConfig>> = {};

  install(instance: TimelineInstance): void {
    this.instance = instance;
  }

  addTemplate(name: string, config: Partial<TimelineConfig>): void {
    this.templates[name] = config;
  }

  applyTemplate(name: string): void {
    if (!this.instance) return;
    const template = this.templates[name];
    if (template) {
      this.instance.update(template);
    }
  }

  uninstall(): void {
    this.instance = null;
    this.templates = {};
  }
}

