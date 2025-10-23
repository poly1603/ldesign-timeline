/**
 * Canvas Renderer
 */

import { BaseRenderer } from './base-renderer';
import { TimelineEvent } from '../types';
import { toTimestamp } from '../utils';
import { ScaleCalculator, ScaleTick } from '../core/scale-calculator';

/**
 * Canvas Renderer
 */
export class CanvasRenderer extends BaseRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private scaleCalculator: ScaleCalculator | null = null;

  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  protected renderTimeline(): void {
    if (!this.layout || !this.options || !this.canvas || !this.ctx) return;

    // Set canvas size
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;

    // Clear canvas
    this.ctx.fillStyle = this.options.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Initialize scale calculator
    if (this.layout.bounds.minTime && this.layout.bounds.maxTime) {
      const orientation = this.options.orientation;
      const viewSize = orientation === 'horizontal'
        ? this.options.width - this.options.margin.left - this.options.margin.right
        : this.options.height - this.options.margin.top - this.options.margin.bottom;

      this.scaleCalculator = new ScaleCalculator(
        this.layout.bounds.minTime,
        this.layout.bounds.maxTime,
        viewSize,
        this.options.scale
      );
      this.scaleCalculator.setZoom(this.zoom);
    }

    // Save context
    this.ctx.save();

    // Render grid
    if (this.options.grid.show) {
      this.renderGrid();
    }

    // Render scale
    if (this.options.scale.showLabels && this.scaleCalculator) {
      this.renderScale();
    }

    // Render today line
    if (this.options.todayLine.show) {
      this.renderTodayLine();
    }

    // Render main timeline line
    this.renderMainLine();

    // Render connection lines
    this.renderConnectionLines();

    // Render events
    for (const event of this.events) {
      if (this.isEventVisible(event)) {
        this.renderEvent(event);
      }
    }

    // Restore context
    this.ctx.restore();
  }

  /**
   * Render grid
   */
  private renderGrid(): void {
    if (!this.ctx || !this.options || !this.scaleCalculator) return;

    const ticks = this.scaleCalculator.getTicks(this.options.scale);
    const orientation = this.options.orientation;

    this.ctx.strokeStyle = this.options.grid.color;
    this.ctx.lineWidth = this.options.grid.lineWidth;
    this.ctx.globalAlpha = this.options.grid.opacity;

    if (this.options.grid.style === 'dashed') {
      this.ctx.setLineDash([5, 5]);
    } else if (this.options.grid.style === 'dotted') {
      this.ctx.setLineDash([2, 2]);
    }

    for (const tick of ticks) {
      const pos = this.applyTransform(
        orientation === 'horizontal' ? tick.position : 0,
        orientation === 'vertical' ? tick.position : 0
      );

      this.ctx.beginPath();

      if (orientation === 'horizontal') {
        this.ctx.moveTo(pos.x, this.options.margin.top);
        this.ctx.lineTo(pos.x, this.options.height - this.options.margin.bottom);
      } else {
        this.ctx.moveTo(this.options.margin.left, pos.y);
        this.ctx.lineTo(this.options.width - this.options.margin.right, pos.y);
      }

      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
    this.ctx.globalAlpha = 1;
  }

  /**
   * Render scale labels
   */
  private renderScale(): void {
    if (!this.ctx || !this.options || !this.scaleCalculator) return;

    const ticks = this.scaleCalculator.getTicks(this.options.scale);
    const orientation = this.options.orientation;

    this.ctx.fillStyle = this.options.scale.color;
    this.ctx.font = `${this.options.scale.fontSize}px ${this.options.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    for (const tick of ticks) {
      const pos = this.applyTransform(
        orientation === 'horizontal' ? tick.position : 0,
        orientation === 'vertical' ? tick.position : 0
      );

      if (orientation === 'horizontal') {
        this.ctx.fillText(tick.label, pos.x, this.options.height - this.options.margin.bottom + 8);
      } else {
        this.ctx.save();
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(tick.label, this.options.margin.left - 8, pos.y);
        this.ctx.restore();
      }
    }
  }

  /**
   * Render today line
   */
  private renderTodayLine(): void {
    if (!this.ctx || !this.options || !this.scaleCalculator) return;

    const today = this.getTodayTimestamp();

    // Check if today is in visible range
    if (today < this.layout!.bounds.minTime || today > this.layout!.bounds.maxTime) {
      return;
    }

    const position = this.scaleCalculator.timeToPosition(today);
    const orientation = this.options.orientation;
    const pos = this.applyTransform(
      orientation === 'horizontal' ? position : 0,
      orientation === 'vertical' ? position : 0
    );

    this.ctx.strokeStyle = this.options.todayLine.color;
    this.ctx.lineWidth = this.options.todayLine.width;

    if (this.options.todayLine.style === 'dashed') {
      this.ctx.setLineDash([5, 5]);
    } else if (this.options.todayLine.style === 'dotted') {
      this.ctx.setLineDash([2, 2]);
    }

    this.ctx.beginPath();

    if (orientation === 'horizontal') {
      this.ctx.moveTo(pos.x, this.options.margin.top);
      this.ctx.lineTo(pos.x, this.options.height - this.options.margin.bottom);
    } else {
      this.ctx.moveTo(this.options.margin.left, pos.y);
      this.ctx.lineTo(this.options.width - this.options.margin.right, pos.y);
    }

    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  /**
   * Render main timeline line
   */
  private renderMainLine(): void {
    if (!this.ctx || !this.options) return;

    const orientation = this.options.orientation;

    this.ctx.strokeStyle = this.options.lineStyle.color;
    this.ctx.lineWidth = this.options.lineStyle.width;
    this.ctx.globalAlpha = this.options.lineStyle.opacity;

    this.ctx.beginPath();

    if (orientation === 'horizontal') {
      const y = this.options.margin.top +
        (this.options.height - this.options.margin.top - this.options.margin.bottom) / 2;
      this.ctx.moveTo(this.options.margin.left, y);
      this.ctx.lineTo(this.options.width - this.options.margin.right, y);
    } else {
      const x = this.options.margin.left +
        (this.options.width - this.options.margin.left - this.options.margin.right) / 2;
      this.ctx.moveTo(x, this.options.margin.top);
      this.ctx.lineTo(x, this.options.height - this.options.margin.bottom);
    }

    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }

  /**
   * Render connection lines
   */
  private renderConnectionLines(): void {
    if (!this.ctx || !this.options) return;

    const orientation = this.options.orientation;
    const centerPos = orientation === 'horizontal'
      ? this.options.margin.top + (this.options.height - this.options.margin.top - this.options.margin.bottom) / 2
      : this.options.margin.left + (this.options.width - this.options.margin.left - this.options.margin.right) / 2;

    this.ctx.strokeStyle = this.options.lineStyle.color;
    this.ctx.lineWidth = 1;
    this.ctx.globalAlpha = this.options.lineStyle.opacity * 0.5;

    for (const event of this.events) {
      if (!this.isEventVisible(event)) continue;

      const position = this.getEventPosition(event);
      if (!position) continue;

      const transformed = this.applyTransform(position.x, position.y);

      this.ctx.beginPath();

      if (orientation === 'horizontal') {
        this.ctx.moveTo(transformed.x, centerPos);
        this.ctx.lineTo(transformed.x, transformed.y);
      } else {
        this.ctx.moveTo(centerPos, transformed.y);
        this.ctx.lineTo(transformed.x, transformed.y);
      }

      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Render event node
   */
  private renderEvent(event: TimelineEvent): void {
    if (!this.ctx || !this.options) return;

    const position = this.getEventPosition(event);
    if (!position) return;

    const transformed = this.applyTransform(position.x, position.y);
    const radius = this.getNodeRadius(event);
    const color = this.getEventColor(event);
    const isHighlighted = this.isHighlighted(event);

    // Draw shadow
    if (this.options.nodeStyle.shadow) {
      this.ctx.shadowColor = this.options.nodeStyle.shadowColor;
      this.ctx.shadowBlur = this.options.nodeStyle.shadowBlur;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 2;
    }

    // Draw node
    this.ctx.beginPath();
    this.ctx.arc(transformed.x, transformed.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    // Draw border
    this.ctx.strokeStyle = this.options.nodeStyle.borderColor;
    this.ctx.lineWidth = this.options.nodeStyle.borderWidth;
    this.ctx.stroke();

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;

    // Highlight effect
    if (isHighlighted) {
      this.ctx.beginPath();
      this.ctx.arc(transformed.x, transformed.y, radius + 4, 0, Math.PI * 2);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.5;
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }

    // Draw text
    this.ctx.fillStyle = this.options.textColor;
    this.ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    const textY = transformed.y + radius + 8;
    this.ctx.fillText(event.title, transformed.x, textY);
  }

  getElement(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Get canvas as data URL
   */
  toDataURL(format: 'png' | 'jpeg' = 'png', quality?: number): string {
    if (!this.canvas) return '';
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return this.canvas.toDataURL(mimeType, quality);
  }

  /**
   * Get canvas
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  clear(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  destroy(): void {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }
}

