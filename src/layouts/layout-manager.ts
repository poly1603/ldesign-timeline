/**
 * Layout Manager - Manages layout strategies
 */

import { TimelineEvent, LayoutResult, RenderOptions, LayoutEngine, Orientation } from '../types';
import { HorizontalLayout } from './horizontal-layout';
import { VerticalLayout } from './vertical-layout';

/**
 * Layout Manager
 */
export class LayoutManager implements LayoutEngine {
  private horizontalLayout: HorizontalLayout;
  private verticalLayout: VerticalLayout;

  constructor() {
    this.horizontalLayout = new HorizontalLayout();
    this.verticalLayout = new VerticalLayout();
  }

  /**
   * Calculate layout based on orientation
   */
  layout(events: TimelineEvent[], options: RenderOptions): LayoutResult {
    const orientation = options.orientation || 'horizontal';

    if (orientation === 'horizontal') {
      return this.horizontalLayout.layout(events, options);
    } else {
      return this.verticalLayout.layout(events, options);
    }
  }

  /**
   * Get event at position
   */
  getEventAtPosition(x: number, y: number, layout: LayoutResult): TimelineEvent | null {
    // Iterate through positions to find event at coordinates
    for (const [eventId, position] of layout.positions) {
      const distance = Math.sqrt(
        Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2)
      );

      // If within reasonable distance (e.g., 20 pixels)
      if (distance < 20) {
        // Find and return the event
        const event = layout.visibleEvents.find(e => e.id === eventId);
        if (event) return event;
      }
    }

    return null;
  }

  /**
   * Get optimal layout strategy
   */
  getOptimalLayout(
    events: TimelineEvent[],
    orientation: Orientation
  ): LayoutEngine {
    // For now, just return based on orientation
    // Could be extended with more intelligent selection
    return orientation === 'horizontal' ? this.horizontalLayout : this.verticalLayout;
  }

  /**
   * Calculate viewport bounds
   */
  getViewportBounds(
    layout: LayoutResult,
    panX: number,
    panY: number,
    zoom: number,
    viewportWidth: number,
    viewportHeight: number
  ): { minX: number; maxX: number; minY: number; maxY: number } {
    // Calculate visible area considering pan and zoom
    const minX = -panX / zoom;
    const maxX = (viewportWidth - panX) / zoom;
    const minY = -panY / zoom;
    const maxY = (viewportHeight - panY) / zoom;

    return { minX, maxX, minY, maxY };
  }

  /**
   * Get visible events in viewport
   */
  getVisibleEventsInViewport(
    events: TimelineEvent[],
    layout: LayoutResult,
    viewportBounds: { minX: number; maxX: number; minY: number; maxY: number }
  ): TimelineEvent[] {
    return events.filter(event => {
      const position = layout.positions.get(event.id);
      if (!position) return false;

      return (
        position.x >= viewportBounds.minX &&
        position.x <= viewportBounds.maxX &&
        position.y >= viewportBounds.minY &&
        position.y <= viewportBounds.maxY
      );
    });
  }
}

