/**
 * Three.js 3D Plugin
 */

import { TimelineInstance, Plugin, ThreeConfig } from '../types';

export class ThreePlugin implements Plugin {
  name = 'three';
  version = '1.0.0';
  private instance: TimelineInstance | null = null;
  private config: ThreeConfig;

  constructor(config: ThreeConfig = {}) {
    this.config = { enabled: false, ...config };
  }

  install(instance: TimelineInstance): void {
    this.instance = instance;
    if (!this.config.enabled) return;
    // Three.js integration would require importing three.js library
    console.info('Three.js plugin installed (requires three.js library)');
  }

  uninstall(): void {
    this.instance = null;
  }
}

