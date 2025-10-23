/**
 * Timeline Generator - Main orchestrator
 */

import {
  TimelineConfig,
  TimelineInstance,
  TimelineEvent,
  EventGroup,
  RenderOptions,
  Orientation,
  ExportConfig,
  NodeStyle,
  LineStyle,
  GridConfig,
  ScaleConfig,
  TodayLineConfig,
} from '../types';
import { EventManager } from './event-manager';
import { ScaleCalculator } from './scale-calculator';
import { CanvasRenderer } from '../renderers/canvas-renderer';
import { SVGRenderer } from '../renderers/svg-renderer';
import { HorizontalLayout } from '../layouts/horizontal-layout';
import { VerticalLayout } from '../layouts/vertical-layout';
import type { Renderer, LayoutEngine } from '../types';
import { downloadFile } from '../utils';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<Omit<TimelineConfig, 'container' | 'events' | 'groups' | 'onClick' | 'onDblClick' | 'onHover' | 'onRangeChange' | 'onZoomChange'>> = {
  orientation: 'horizontal',
  renderType: 'canvas',
  width: 800,
  height: 600,
  margin: { top: 40, right: 40, bottom: 40, left: 40 },
  background: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  fontSize: 12,
  textColor: '#333333',
  nodeStyle: {
    size: 12,
    color: '#1890ff',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadow: true,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowBlur: 4,
    opacity: 1,
  },
  lineStyle: {
    width: 2,
    color: '#d9d9d9',
    style: 'solid',
    opacity: 1,
  },
  grid: {
    show: true,
    color: '#f0f0f0',
    lineWidth: 1,
    style: 'solid',
    opacity: 0.5,
  },
  scale: {
    unit: undefined,
    auto: true,
    format: undefined,
    showLabels: true,
    fontSize: 11,
    color: '#999999',
  },
  animation: {
    enabled: true,
    entrance: true,
    entranceType: 'fade',
    entranceDuration: 600,
    entranceDelay: 50,
    scroll: false,
    parallax: 0.5,
    pulse: false,
    pulseDuration: 1000,
    lineAnimation: false,
    lineAnimationDuration: 1000,
    easing: 'easeOut',
  },
  zoom: {
    enabled: true,
    min: 0.1,
    max: 10,
    step: 0.1,
    smooth: true,
    wheel: true,
    pinch: true,
  },
  pan: {
    enabled: true,
    inertia: true,
    friction: 0.95,
    boundary: true,
    touch: true,
  },
  drag: {
    enabled: false,
    snap: false,
    snapInterval: 60000,
    preview: true,
  },
  selection: {
    enabled: true,
    multi: false,
    box: false,
    keyboard: true,
  },
  keyboard: {
    enabled: true,
    bindings: {},
  },
  tooltip: {
    show: true,
    delay: 200,
  },
  todayLine: {
    show: true,
    color: '#ff4d4f',
    width: 2,
    style: 'dashed',
  },
  three: {
    enabled: false,
    cameraPosition: { x: 0, y: 0, z: 500 },
    cameraRotation: { x: 0, y: 0, z: 0 },
    controls: true,
    depth: 100,
    shape3d: 'sphere',
    lighting: true,
    shadow: false,
    antialias: true,
  },
  export: {
    format: 'png',
    quality: 1,
    background: '#ffffff',
    scale: 1,
  },
  realtime: {
    enabled: false,
    reconnectAttempts: 3,
    reconnectInterval: 5000,
    bufferSize: 100,
  },
  template: {},
  className: '',
  style: {},
};

/**
 * Timeline Instance Implementation
 */
class TimelineInstanceImpl implements TimelineInstance {
  private config: TimelineConfig;
  private eventManager: EventManager;
  private scaleCalculator: ScaleCalculator | null = null;
  private renderer: Renderer;
  private layout: LayoutEngine;
  private currentZoom: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private selectedEventIds: Set<string> = new Set();
  private hoveredEventId: string | null = null;

  constructor(config: TimelineConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize event manager
    this.eventManager = new EventManager(config.events, config.groups);

    // Create renderer
    const renderType = this.config.renderType || 'canvas';
    this.renderer = renderType === 'svg' ? new SVGRenderer() : new CanvasRenderer();

    // Create layout engine
    const orientation = this.config.orientation || 'horizontal';
    this.layout = orientation === 'horizontal' ? new HorizontalLayout() : new VerticalLayout();

    // Initial render
    this.render();

    // Append to container if provided
    if (config.container) {
      const element = this.getElement();
      if (element) {
        // Clear container
        config.container.innerHTML = '';
        config.container.appendChild(element);
      }
    }
  }

  /**
   * Render timeline
   */
  private render(): void {
    const fullConfig = { ...DEFAULT_CONFIG, ...this.config };

    // Get visible events
    const events = this.eventManager.getVisibleEvents();

    if (events.length === 0) {
      this.renderer.clear();
      return;
    }

    // Get time range
    const timeRange = this.eventManager.getTimeRange();

    // Calculate view size
    const orientation = fullConfig.orientation;
    const viewSize = orientation === 'horizontal'
      ? fullConfig.width - fullConfig.margin.left - fullConfig.margin.right
      : fullConfig.height - fullConfig.margin.top - fullConfig.margin.bottom;

    // Initialize scale calculator
    this.scaleCalculator = new ScaleCalculator(
      timeRange.min,
      timeRange.max,
      viewSize,
      fullConfig.scale
    );
    this.scaleCalculator.setZoom(this.currentZoom);

    // Prepare render options
    const renderOptions: RenderOptions = {
      renderType: fullConfig.renderType,
      orientation: fullConfig.orientation,
      width: fullConfig.width,
      height: fullConfig.height,
      margin: fullConfig.margin,
      background: fullConfig.background,
      fontFamily: fullConfig.fontFamily,
      fontSize: fullConfig.fontSize,
      textColor: fullConfig.textColor,
      nodeStyle: { ...DEFAULT_CONFIG.nodeStyle, ...fullConfig.nodeStyle } as Required<NodeStyle>,
      lineStyle: { ...DEFAULT_CONFIG.lineStyle, ...fullConfig.lineStyle } as Required<LineStyle>,
      grid: { ...DEFAULT_CONFIG.grid, ...fullConfig.grid } as Required<GridConfig>,
      scale: { ...DEFAULT_CONFIG.scale, ...fullConfig.scale } as Required<ScaleConfig>,
      todayLine: { ...DEFAULT_CONFIG.todayLine, ...fullConfig.todayLine } as Required<TodayLineConfig>,
    };

    // Calculate layout
    const layoutResult = this.layout.layout(events, renderOptions);

    // Render
    this.renderer.render(events, layoutResult, renderOptions);
    this.renderer.updateTransform(this.currentZoom, this.panX, this.panY);
  }

  async update(config: Partial<TimelineConfig>): Promise<void> {
    // Update events if provided
    if (config.events) {
      this.eventManager.clear();
      this.eventManager.batchAddEvents(config.events);
    }

    // Update groups if provided
    if (config.groups) {
      config.groups.forEach(group => {
        if (this.eventManager.getGroup(group.id)) {
          this.eventManager.updateGroup(group.id, group);
        } else {
          this.eventManager.addGroup(group);
        }
      });
    }

    // Update config
    this.config = { ...this.config, ...config };

    // Re-render
    this.render();
  }

  addEvent(event: TimelineEvent): void {
    this.eventManager.addEvent(event);
    this.render();
  }

  removeEvent(eventId: string): void {
    this.eventManager.removeEvent(eventId);
    this.selectedEventIds.delete(eventId);
    this.render();
  }

  updateEvent(eventId: string, event: Partial<TimelineEvent>): void {
    this.eventManager.updateEvent(eventId, event);
    this.render();
  }

  getEvent(eventId: string): TimelineEvent | undefined {
    return this.eventManager.getEvent(eventId);
  }

  getEvents(): TimelineEvent[] {
    return this.eventManager.getEvents();
  }

  filterEvents(predicate: (event: TimelineEvent) => boolean): TimelineEvent[] {
    return this.eventManager.filterEvents(predicate);
  }

  addGroup(group: EventGroup): void {
    this.eventManager.addGroup(group);
  }

  removeGroup(groupId: string): void {
    this.eventManager.removeGroup(groupId);
    this.render();
  }

  updateGroup(groupId: string, group: Partial<EventGroup>): void {
    this.eventManager.updateGroup(groupId, group);
    this.render();
  }

  zoomIn(): void {
    const config = this.config.zoom || DEFAULT_CONFIG.zoom;
    const newZoom = Math.min(this.currentZoom + config.step, config.max);
    this.setZoom(newZoom);
  }

  zoomOut(): void {
    const config = this.config.zoom || DEFAULT_CONFIG.zoom;
    const newZoom = Math.max(this.currentZoom - config.step, config.min);
    this.setZoom(newZoom);
  }

  setZoom(level: number): void {
    const config = this.config.zoom || DEFAULT_CONFIG.zoom;
    this.currentZoom = Math.max(config.min, Math.min(config.max, level));

    if (this.scaleCalculator) {
      this.scaleCalculator.setZoom(this.currentZoom);
    }

    this.render();

    if (this.config.onZoomChange) {
      this.config.onZoomChange(this.currentZoom);
    }
  }

  getZoom(): number {
    return this.currentZoom;
  }

  panTo(x: number, y: number): void {
    this.panX = x;
    this.panY = y;
    this.renderer.updateTransform(this.currentZoom, this.panX, this.panY);
  }

  centerOn(eventId: string): void {
    const event = this.eventManager.getEvent(eventId);
    if (!event || !this.scaleCalculator) return;

    const timestamp = typeof event.timestamp === 'number' ? event.timestamp : event.timestamp.getTime();
    const position = this.scaleCalculator.timeToPosition(timestamp);

    const orientation = this.config.orientation || 'horizontal';
    const viewSize = orientation === 'horizontal' ? this.config.width || 800 : this.config.height || 600;

    if (orientation === 'horizontal') {
      this.panX = viewSize / 2 - position;
    } else {
      this.panY = viewSize / 2 - position;
    }

    this.renderer.updateTransform(this.currentZoom, this.panX, this.panY);
  }

  fit(): void {
    this.currentZoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.render();
  }

  getSelection(): TimelineEvent[] {
    return Array.from(this.selectedEventIds)
      .map(id => this.eventManager.getEvent(id))
      .filter((event): event is TimelineEvent => event !== undefined);
  }

  setSelection(eventIds: string[]): void {
    this.selectedEventIds = new Set(eventIds);
    // Update visual selection state
    this.render();

    if (this.config.selection?.onSelect) {
      this.config.selection.onSelect(this.getSelection());
    }
  }

  clearSelection(): void {
    this.selectedEventIds.clear();
    this.render();
  }

  toDataURL(format: 'png' | 'jpeg' = 'png', quality?: number): string {
    if (this.renderer instanceof CanvasRenderer) {
      return this.renderer.toDataURL(format, quality);
    }
    throw new Error('toDataURL is only available for canvas render type');
  }

  toSVGString(): string {
    if (this.renderer instanceof SVGRenderer) {
      return this.renderer.toSVGString();
    }
    throw new Error('toSVGString is only available for SVG render type');
  }

  async export(config?: ExportConfig): Promise<Blob | string> {
    const exportConfig = { ...DEFAULT_CONFIG.export, ...config };

    if (exportConfig.format === 'svg') {
      return this.toSVGString();
    }

    if (exportConfig.format === 'png' || exportConfig.format === 'jpeg') {
      const dataURL = this.toDataURL(exportConfig.format, exportConfig.quality);
      const response = await fetch(dataURL);
      return response.blob();
    }

    // PDF export would require additional library (jsPDF)
    throw new Error(`Export format ${exportConfig.format} not yet implemented`);
  }

  download(fileName?: string, format?: 'png' | 'jpeg' | 'svg' | 'pdf'): void {
    const fmt = format || 'png';
    const name = fileName || `timeline-${Date.now()}.${fmt}`;

    if (fmt === 'svg') {
      const svgString = this.toSVGString();
      downloadFile(svgString, name, 'image/svg+xml');
    } else if (fmt === 'png' || fmt === 'jpeg') {
      const dataURL = this.toDataURL(fmt);
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  play(): void {
    // Animation play functionality to be implemented
    console.info('Animation play not yet implemented');
  }

  pause(): void {
    // Animation pause functionality to be implemented
    console.info('Animation pause not yet implemented');
  }

  stop(): void {
    // Animation stop functionality to be implemented
    console.info('Animation stop not yet implemented');
  }

  destroy(): void {
    this.renderer.destroy();
    this.eventManager.clear();
  }

  getElement(): HTMLCanvasElement | SVGSVGElement | null {
    return this.renderer.getElement();
  }

  getContainer(): HTMLElement | null {
    return this.config.container || null;
  }
}

/**
 * Timeline Generator
 */
export class TimelineGenerator {
  /**
   * Generate a timeline
   */
  static generate(config: TimelineConfig): TimelineInstance {
    return new TimelineInstanceImpl(config);
  }

  /**
   * Create timeline instance (alias)
   */
  static create(config: TimelineConfig): TimelineInstance {
    return this.generate(config);
  }

  /**
   * Generate timeline as data URL
   */
  static async toDataURL(
    events: TimelineEvent[],
    options?: Partial<TimelineConfig>
  ): Promise<string> {
    const instance = this.generate({
      events,
      renderType: 'canvas',
      ...options,
    });

    const dataURL = instance.toDataURL();
    instance.destroy();
    return dataURL;
  }

  /**
   * Generate timeline as SVG string
   */
  static toSVGString(
    events: TimelineEvent[],
    options?: Partial<TimelineConfig>
  ): string {
    const instance = this.generate({
      events,
      renderType: 'svg',
      ...options,
    });

    const svgString = instance.toSVGString();
    instance.destroy();
    return svgString;
  }
}

/**
 * Convenience function to create timeline
 */
export function createTimeline(config: TimelineConfig): TimelineInstance {
  return TimelineGenerator.generate(config);
}

/**
 * Convenience function to generate in container
 */
export function generateTimeline(
  container: HTMLElement,
  config: Omit<TimelineConfig, 'container'>
): TimelineInstance {
  return TimelineGenerator.generate({ ...config, container });
}

