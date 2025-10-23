/**
 * Vertical Layout Engine
 */

import { TimelineEvent, LayoutResult, RenderOptions, LayoutEngine } from '../types';
import { toTimestamp } from '../utils';

/**
 * Vertical Layout
 */
export class VerticalLayout implements LayoutEngine {
  /**
   * Calculate layout for vertical timeline
   */
  layout(events: TimelineEvent[], options: RenderOptions): LayoutResult {
    const positions = new Map<string, { x: number; y: number }>();

    if (events.length === 0) {
      return {
        positions,
        bounds: { minTime: 0, maxTime: 0, width: 0, height: 0 },
        visibleEvents: [],
      };
    }

    // Get time range
    const timestamps = events.map(e => toTimestamp(e.timestamp));
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeRange = maxTime - minTime || 1;

    // Calculate available space
    const availableWidth = options.width - options.margin.left - options.margin.right;
    const availableHeight = options.height - options.margin.top - options.margin.bottom;
    const centerX = availableWidth / 2;

    // Track used X positions to avoid overlap
    const usedPositions: Array<{ x: number; y: number; height: number }> = [];
    const nodeSize = options.nodeStyle.size;
    const minSpacing = nodeSize * 3; // Minimum spacing between nodes

    // Calculate positions for each event
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const timestamp = toTimestamp(event.timestamp);

      // Calculate Y position based on timestamp
      const normalizedTime = timeRange > 0 ? (timestamp - minTime) / timeRange : 0.5;
      const y = normalizedTime * availableHeight;

      // Calculate X position (alternate left and right of center line)
      let x: number;
      const side = i % 2 === 0 ? -1 : 1; // Alternate sides
      const baseOffset = nodeSize * 4; // Base distance from center
      const layerOffset = Math.floor(i / 2) * (nodeSize * 2.5); // Additional offset for each layer

      x = centerX + (side * (baseOffset + layerOffset));

      // Check for overlaps and adjust X position if needed
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const overlaps = usedPositions.some(pos => {
          const dx = Math.abs(pos.x - x);
          const dy = Math.abs(pos.y - y);
          return dy < minSpacing && dx < nodeSize * 2;
        });

        if (!overlaps) {
          break;
        }

        // Try different X position
        x += side * (nodeSize * 1.5);
        attempts++;
      }

      // Ensure X is within bounds
      x = Math.max(nodeSize, Math.min(availableWidth - nodeSize, x));

      positions.set(event.id, { x, y });
      usedPositions.push({ x, y, height: nodeSize * 2 });
    }

    return {
      positions,
      bounds: {
        minTime,
        maxTime,
        width: availableWidth,
        height: availableHeight,
      },
      visibleEvents: events,
    };
  }

  /**
   * Get event at position
   */
  getEventAtPosition(x: number, y: number, layout: LayoutResult): TimelineEvent | null {
    // This would need the events list and options to implement properly
    // For now, return null
    return null;
  }
}

