/**
 * Scale Calculator - Calculate time scale and ticks
 */

import { TimeScale, ScaleConfig, Orientation } from '../types';
import {
  getTimeScale,
  getScaleFormat,
  getScaleInterval,
  generateScaleTicks,
  formatDate,
} from '../utils';

/**
 * Scale tick
 */
export interface ScaleTick {
  value: number;
  label: string;
  position: number;
}

/**
 * Scale Calculator
 */
export class ScaleCalculator {
  private minTime: number = 0;
  private maxTime: number = 0;
  private timeRange: number = 0;
  private viewSize: number = 0;
  private scale: TimeScale = TimeScale.DAY;
  private zoom: number = 1;

  /**
   * Initialize scale calculator
   */
  constructor(
    minTime: number,
    maxTime: number,
    viewSize: number,
    scaleConfig?: ScaleConfig
  ) {
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.timeRange = maxTime - minTime;
    this.viewSize = viewSize;

    // Determine scale
    if (scaleConfig?.unit && !scaleConfig.auto) {
      this.scale = scaleConfig.unit;
    } else {
      this.scale = getTimeScale(this.timeRange);
    }
  }

  /**
   * Set zoom level
   */
  setZoom(zoom: number): void {
    this.zoom = zoom;
  }

  /**
   * Get zoom level
   */
  getZoom(): number {
    return this.zoom;
  }

  /**
   * Set time range
   */
  setTimeRange(minTime: number, maxTime: number): void {
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.timeRange = maxTime - minTime;
    this.scale = getTimeScale(this.timeRange / this.zoom);
  }

  /**
   * Set view size
   */
  setViewSize(size: number): void {
    this.viewSize = size;
  }

  /**
   * Convert timestamp to position
   */
  timeToPosition(timestamp: number): number {
    if (this.timeRange === 0) return 0;
    const normalizedTime = (timestamp - this.minTime) / this.timeRange;
    return normalizedTime * this.viewSize * this.zoom;
  }

  /**
   * Convert position to timestamp
   */
  positionToTime(position: number): number {
    if (this.viewSize === 0 || this.zoom === 0) return this.minTime;
    const normalizedPosition = position / (this.viewSize * this.zoom);
    return this.minTime + normalizedPosition * this.timeRange;
  }

  /**
   * Get scale ticks
   */
  getTicks(scaleConfig?: ScaleConfig): ScaleTick[] {
    const ticks: ScaleTick[] = [];

    // Get time values for ticks
    const timeValues = generateScaleTicks(this.minTime, this.maxTime, this.scale);

    // Get format string
    const format = scaleConfig?.format || getScaleFormat(this.scale);

    // Create tick objects
    for (const time of timeValues) {
      ticks.push({
        value: time,
        label: formatDate(time, format),
        position: this.timeToPosition(time),
      });
    }

    return ticks;
  }

  /**
   * Get visible ticks (in viewport)
   */
  getVisibleTicks(
    panOffset: number,
    viewportSize: number,
    scaleConfig?: ScaleConfig
  ): ScaleTick[] {
    const allTicks = this.getTicks(scaleConfig);

    return allTicks.filter(tick => {
      const screenPosition = tick.position + panOffset;
      return screenPosition >= 0 && screenPosition <= viewportSize;
    });
  }

  /**
   * Get scale interval
   */
  getInterval(): number {
    return getScaleInterval(this.scale);
  }

  /**
   * Get current scale
   */
  getScale(): TimeScale {
    return this.scale;
  }

  /**
   * Set scale
   */
  setScale(scale: TimeScale): void {
    this.scale = scale;
  }

  /**
   * Get pixel per millisecond
   */
  getPixelPerMs(): number {
    if (this.timeRange === 0) return 0;
    return (this.viewSize * this.zoom) / this.timeRange;
  }

  /**
   * Get milliseconds per pixel
   */
  getMsPerPixel(): number {
    const pixelPerMs = this.getPixelPerMs();
    return pixelPerMs === 0 ? 0 : 1 / pixelPerMs;
  }

  /**
   * Calculate optimal tick count
   */
  getOptimalTickCount(): number {
    // Aim for a tick every 60-100 pixels
    const optimalSpacing = 80;
    return Math.max(2, Math.floor(this.viewSize / optimalSpacing));
  }

  /**
   * Snap time to nearest tick
   */
  snapToTick(timestamp: number): number {
    const interval = this.getInterval();
    return Math.round(timestamp / interval) * interval;
  }

  /**
   * Get time range info
   */
  getTimeRangeInfo(): {
    min: number;
    max: number;
    range: number;
    scale: TimeScale;
    zoom: number;
  } {
    return {
      min: this.minTime,
      max: this.maxTime,
      range: this.timeRange,
      scale: this.scale,
      zoom: this.zoom,
    };
  }

  /**
   * Check if timestamp is in range
   */
  isInRange(timestamp: number): boolean {
    return timestamp >= this.minTime && timestamp <= this.maxTime;
  }

  /**
   * Get visible time range (considering zoom and pan)
   */
  getVisibleTimeRange(panOffset: number, viewportSize: number): {
    start: number;
    end: number;
  } {
    const start = this.positionToTime(-panOffset);
    const end = this.positionToTime(-panOffset + viewportSize);

    return { start, end };
  }
}

