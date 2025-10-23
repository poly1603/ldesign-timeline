/**
 * SVG Renderer
 */

import { BaseRenderer } from './base-renderer';
import { TimelineEvent } from '../types';
import { createSVGElement, toTimestamp } from '../utils';
import { ScaleCalculator } from '../core/scale-calculator';

/**
 * SVG Renderer
 */
export class SVGRenderer extends BaseRenderer {
  private svg: SVGSVGElement | null = null;
  private scaleCalculator: ScaleCalculator | null = null;
  private defs: SVGDefsElement | null = null;

  constructor() {
    super();
    this.svg = createSVGElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
    });

    // Create defs for filters and gradients
    this.defs = createSVGElement('defs');
    this.svg.appendChild(this.defs);
  }

  protected renderTimeline(): void {
    if (!this.layout || !this.options || !this.svg) return;

    // Set SVG size
    this.svg.setAttribute('width', String(this.options.width));
    this.svg.setAttribute('height', String(this.options.height));
    this.svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);

    // Clear previous content (except defs)
    while (this.svg.childNodes.length > 1) {
      this.svg.removeChild(this.svg.lastChild!);
    }

    // Create main group with transform
    const mainGroup = createSVGElement('g', {
      class: 'timeline-main',
    });
    this.svg.appendChild(mainGroup);

    // Background
    const background = createSVGElement('rect', {
      width: String(this.options.width),
      height: String(this.options.height),
      fill: this.options.background,
    });
    mainGroup.appendChild(background);

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

    // Render grid
    if (this.options.grid.show) {
      this.renderGrid(mainGroup);
    }

    // Render scale
    if (this.options.scale.showLabels && this.scaleCalculator) {
      this.renderScale(mainGroup);
    }

    // Render today line
    if (this.options.todayLine.show) {
      this.renderTodayLine(mainGroup);
    }

    // Render main timeline line
    this.renderMainLine(mainGroup);

    // Render connection lines
    this.renderConnectionLines(mainGroup);

    // Render events
    const eventsGroup = createSVGElement('g', { class: 'timeline-events' });
    mainGroup.appendChild(eventsGroup);

    for (const event of this.events) {
      if (this.isEventVisible(event)) {
        this.renderEvent(event, eventsGroup);
      }
    }
  }

  /**
   * Render grid
   */
  private renderGrid(parent: SVGElement): void {
    if (!this.options || !this.scaleCalculator) return;

    const gridGroup = createSVGElement('g', { class: 'timeline-grid' });
    parent.appendChild(gridGroup);

    const ticks = this.scaleCalculator.getTicks(this.options.scale);
    const orientation = this.options.orientation;

    for (const tick of ticks) {
      const pos = this.applyTransform(
        orientation === 'horizontal' ? tick.position : 0,
        orientation === 'vertical' ? tick.position : 0
      );

      const line = createSVGElement('line', {
        x1: String(orientation === 'horizontal' ? pos.x : this.options.margin.left),
        y1: String(orientation === 'horizontal' ? this.options.margin.top : pos.y),
        x2: String(orientation === 'horizontal' ? pos.x : this.options.width - this.options.margin.right),
        y2: String(orientation === 'horizontal' ? this.options.height - this.options.margin.bottom : pos.y),
        stroke: this.options.grid.color,
        'stroke-width': String(this.options.grid.lineWidth),
        'stroke-opacity': String(this.options.grid.opacity),
        'stroke-dasharray': this.options.grid.style === 'dashed' ? '5,5' : this.options.grid.style === 'dotted' ? '2,2' : 'none',
      });
      gridGroup.appendChild(line);
    }
  }

  /**
   * Render scale labels
   */
  private renderScale(parent: SVGElement): void {
    if (!this.options || !this.scaleCalculator) return;

    const scaleGroup = createSVGElement('g', { class: 'timeline-scale' });
    parent.appendChild(scaleGroup);

    const ticks = this.scaleCalculator.getTicks(this.options.scale);
    const orientation = this.options.orientation;

    for (const tick of ticks) {
      const pos = this.applyTransform(
        orientation === 'horizontal' ? tick.position : 0,
        orientation === 'vertical' ? tick.position : 0
      );

      const text = createSVGElement('text', {
        x: String(orientation === 'horizontal' ? pos.x : this.options.margin.left - 8),
        y: String(orientation === 'horizontal' ? this.options.height - this.options.margin.bottom + 20 : pos.y),
        fill: this.options.scale.color,
        'font-family': this.options.fontFamily,
        'font-size': String(this.options.scale.fontSize),
        'text-anchor': orientation === 'horizontal' ? 'middle' : 'end',
        'dominant-baseline': orientation === 'horizontal' ? 'hanging' : 'middle',
      });
      text.textContent = tick.label;
      scaleGroup.appendChild(text);
    }
  }

  /**
   * Render today line
   */
  private renderTodayLine(parent: SVGElement): void {
    if (!this.options || !this.scaleCalculator) return;

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

    const line = createSVGElement('line', {
      x1: String(orientation === 'horizontal' ? pos.x : this.options.margin.left),
      y1: String(orientation === 'horizontal' ? this.options.margin.top : pos.y),
      x2: String(orientation === 'horizontal' ? pos.x : this.options.width - this.options.margin.right),
      y2: String(orientation === 'horizontal' ? this.options.height - this.options.margin.bottom : pos.y),
      stroke: this.options.todayLine.color,
      'stroke-width': String(this.options.todayLine.width),
      'stroke-dasharray': this.options.todayLine.style === 'dashed' ? '5,5' : this.options.todayLine.style === 'dotted' ? '2,2' : 'none',
      class: 'timeline-today',
    });
    parent.appendChild(line);
  }

  /**
   * Render main timeline line
   */
  private renderMainLine(parent: SVGElement): void {
    if (!this.options) return;

    const orientation = this.options.orientation;

    const line = createSVGElement('line', {
      x1: String(orientation === 'horizontal' ? this.options.margin.left :
        this.options.margin.left + (this.options.width - this.options.margin.left - this.options.margin.right) / 2),
      y1: String(orientation === 'horizontal' ?
        this.options.margin.top + (this.options.height - this.options.margin.top - this.options.margin.bottom) / 2 :
        this.options.margin.top),
      x2: String(orientation === 'horizontal' ? this.options.width - this.options.margin.right :
        this.options.margin.left + (this.options.width - this.options.margin.left - this.options.margin.right) / 2),
      y2: String(orientation === 'horizontal' ?
        this.options.margin.top + (this.options.height - this.options.margin.top - this.options.margin.bottom) / 2 :
        this.options.height - this.options.margin.bottom),
      stroke: this.options.lineStyle.color,
      'stroke-width': String(this.options.lineStyle.width),
      'stroke-opacity': String(this.options.lineStyle.opacity),
      class: 'timeline-main-line',
    });
    parent.appendChild(line);
  }

  /**
   * Render connection lines
   */
  private renderConnectionLines(parent: SVGElement): void {
    if (!this.options) return;

    const linesGroup = createSVGElement('g', { class: 'timeline-connections' });
    parent.appendChild(linesGroup);

    const orientation = this.options.orientation;
    const centerPos = orientation === 'horizontal'
      ? this.options.margin.top + (this.options.height - this.options.margin.top - this.options.margin.bottom) / 2
      : this.options.margin.left + (this.options.width - this.options.margin.left - this.options.margin.right) / 2;

    for (const event of this.events) {
      if (!this.isEventVisible(event)) continue;

      const position = this.getEventPosition(event);
      if (!position) continue;

      const transformed = this.applyTransform(position.x, position.y);

      const line = createSVGElement('line', {
        x1: String(orientation === 'horizontal' ? transformed.x : centerPos),
        y1: String(orientation === 'horizontal' ? centerPos : transformed.y),
        x2: String(transformed.x),
        y2: String(transformed.y),
        stroke: this.options.lineStyle.color,
        'stroke-width': '1',
        'stroke-opacity': String(this.options.lineStyle.opacity * 0.5),
      });
      linesGroup.appendChild(line);
    }
  }

  /**
   * Render event node
   */
  private renderEvent(event: TimelineEvent, parent: SVGElement): void {
    if (!this.options) return;

    const position = this.getEventPosition(event);
    if (!position) return;

    const transformed = this.applyTransform(position.x, position.y);
    const radius = this.getNodeRadius(event);
    const color = this.getEventColor(event);
    const isHighlighted = this.isHighlighted(event);

    // Create event group
    const eventGroup = createSVGElement('g', {
      class: `timeline-event ${isHighlighted ? 'highlighted' : ''}`,
      'data-event-id': event.id,
    });
    parent.appendChild(eventGroup);

    // Add shadow filter
    if (this.options.nodeStyle.shadow) {
      const filterId = `shadow-${event.id}`;
      const filter = createSVGElement('filter', { id: filterId });
      const feGaussianBlur = createSVGElement('feGaussianBlur', {
        in: 'SourceAlpha',
        stdDeviation: String(this.options.nodeStyle.shadowBlur / 2),
      });
      const feOffset = createSVGElement('feOffset', {
        dx: '0',
        dy: '2',
        result: 'offsetblur',
      });
      const feFlood = createSVGElement('feFlood', {
        'flood-color': this.options.nodeStyle.shadowColor,
      });
      const feComposite = createSVGElement('feComposite', {
        in2: 'offsetblur',
        operator: 'in',
      });
      const feMerge = createSVGElement('feMerge');
      const feMergeNode1 = createSVGElement('feMergeNode');
      const feMergeNode2 = createSVGElement('feMergeNode', { in: 'SourceGraphic' });

      filter.appendChild(feGaussianBlur);
      filter.appendChild(feOffset);
      filter.appendChild(feFlood);
      filter.appendChild(feComposite);
      feMerge.appendChild(feMergeNode1);
      feMerge.appendChild(feMergeNode2);
      filter.appendChild(feMerge);
      this.defs!.appendChild(filter);

      eventGroup.setAttribute('filter', `url(#${filterId})`);
    }

    // Draw node
    const circle = createSVGElement('circle', {
      cx: String(transformed.x),
      cy: String(transformed.y),
      r: String(radius),
      fill: color,
      stroke: this.options.nodeStyle.borderColor,
      'stroke-width': String(this.options.nodeStyle.borderWidth),
      opacity: String(this.options.nodeStyle.opacity),
    });
    eventGroup.appendChild(circle);

    // Highlight effect
    if (isHighlighted) {
      const highlightCircle = createSVGElement('circle', {
        cx: String(transformed.x),
        cy: String(transformed.y),
        r: String(radius + 4),
        fill: 'none',
        stroke: color,
        'stroke-width': '2',
        opacity: '0.5',
      });
      eventGroup.appendChild(highlightCircle);
    }

    // Draw text
    const text = createSVGElement('text', {
      x: String(transformed.x),
      y: String(transformed.y + radius + 18),
      fill: this.options.textColor,
      'font-family': this.options.fontFamily,
      'font-size': String(this.options.fontSize),
      'text-anchor': 'middle',
    });
    text.textContent = event.title;
    eventGroup.appendChild(text);
  }

  getElement(): SVGSVGElement | null {
    return this.svg;
  }

  /**
   * Get SVG string
   */
  toSVGString(): string {
    if (!this.svg) return '';
    return new XMLSerializer().serializeToString(this.svg);
  }

  /**
   * Download as SVG file
   */
  download(fileName: string): void {
    if (!this.svg) return;

    const svgString = this.toSVGString();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  clear(): void {
    if (this.svg) {
      while (this.svg.childNodes.length > 1) {
        this.svg.removeChild(this.svg.lastChild!);
      }
    }
  }

  destroy(): void {
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
    this.svg = null;
    this.defs = null;
  }
}

