/**
 * Base renderer for timeline
 */

import { TimelineEvent, LayoutResult, RenderOptions, Renderer } from '../types';

/**
 * Abstract base renderer
 */
export abstract class BaseRenderer implements Renderer {
  protected events: TimelineEvent[] = [];
  protected layout: LayoutResult | null = null;
  protected options: RenderOptions | null = null;
  protected zoom: number = 1;
  protected panX: number = 0;
  protected panY: number = 0;
  protected highlightedEventId: string | null = null;

  /**
   * Render timeline
   */
  render(events: TimelineEvent[], layout: LayoutResult, options: RenderOptions): void {
    this.events = events;
    this.layout = layout;
    this.options = options;
    this.renderTimeline();
  }

  /**
   * Abstract render method
   */
  protected abstract renderTimeline(): void;

  /**
   * Get rendered element
   */
  abstract getElement(): HTMLCanvasElement | SVGSVGElement | null;

  /**
   * Update view transform
   */
  updateTransform(zoom: number, panX: number, panY: number): void {
    this.zoom = zoom;
    this.panX = panX;
    this.panY = panY;
    this.renderTimeline();
  }

  /**
   * Highlight event
   */
  highlightEvent(eventId: string | null): void {
    this.highlightedEventId = eventId;
    this.renderTimeline();
  }

  /**
   * Clear renderer
   */
  abstract clear(): void;

  /**
   * Destroy renderer
   */
  abstract destroy(): void;

  /**
   * Get event position
   */
  protected getEventPosition(event: TimelineEvent): { x: number; y: number } | null {
    if (!this.layout) return null;
    return this.layout.positions.get(event.id) || null;
  }

  /**
   * Apply transform to coordinates
   */
  protected applyTransform(x: number, y: number): { x: number; y: number } {
    if (!this.options) return { x, y };

    const orientation = this.options.orientation;

    if (orientation === 'horizontal') {
      return {
        x: x * this.zoom + this.panX + this.options.margin.left,
        y: y + this.options.margin.top,
      };
    } else {
      return {
        x: x + this.options.margin.left,
        y: y * this.zoom + this.panY + this.options.margin.top,
      };
    }
  }

  /**
   * Check if event is visible in viewport
   */
  protected isEventVisible(event: TimelineEvent): boolean {
    if (!this.layout || !this.options) return false;

    const position = this.getEventPosition(event);
    if (!position) return false;

    const transformed = this.applyTransform(position.x, position.y);
    const orientation = this.options.orientation;

    if (orientation === 'horizontal') {
      return (
        transformed.x >= this.options.margin.left &&
        transformed.x <= this.options.width - this.options.margin.right
      );
    } else {
      return (
        transformed.y >= this.options.margin.top &&
        transformed.y <= this.options.height - this.options.margin.bottom
      );
    }
  }

  /**
   * Get node radius
   */
  protected getNodeRadius(event: TimelineEvent): number {
    if (!this.options) return 6;
    return this.options.nodeStyle.size / 2;
  }

  /**
   * Get event color
   */
  protected getEventColor(event: TimelineEvent): string {
    if (event.color) return event.color;
    if (!this.options) return '#1890ff';
    return this.options.nodeStyle.color;
  }

  /**
   * Check if event is highlighted
   */
  protected isHighlighted(event: TimelineEvent): boolean {
    return this.highlightedEventId === event.id;
  }

  /**
   * Get today timestamp
   */
  protected getTodayTimestamp(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }
}

