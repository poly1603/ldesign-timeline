/**
 * Zoom Controller
 */

import { TimelineInstance, ZoomConfig, Controller } from '../types';
import { clamp } from '../utils';

/**
 * Zoom Controller
 */
export class ZoomController implements Controller {
  private instance: TimelineInstance | null = null;
  private element: HTMLElement | null = null;
  private config: ZoomConfig;
  private isZooming: boolean = false;
  private zoomTarget: number | null = null;
  private zoomStartTime: number = 0;
  private animationFrame: number | null = null;

  // Event listeners cleanup
  private cleanupFns: Array<() => void> = [];

  constructor(config: ZoomConfig = {}) {
    this.config = {
      enabled: true,
      min: 0.1,
      max: 10,
      step: 0.1,
      smooth: true,
      wheel: true,
      pinch: true,
      ...config,
    };
  }

  /**
   * Initialize controller
   */
  init(element: HTMLElement, instance: TimelineInstance): void {
    this.element = element;
    this.instance = instance;

    if (!this.config.enabled) return;

    // Mouse wheel zoom
    if (this.config.wheel) {
      const wheelHandler = (e: WheelEvent) => this.handleWheel(e);
      element.addEventListener('wheel', wheelHandler, { passive: false });
      this.cleanupFns.push(() => element.removeEventListener('wheel', wheelHandler));
    }

    // Touch pinch zoom
    if (this.config.pinch) {
      let lastDistance: number | null = null;

      const touchStartHandler = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          lastDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
        }
      };

      const touchMoveHandler = (e: TouchEvent) => {
        if (e.touches.length === 2 && lastDistance !== null) {
          e.preventDefault();
          const distance = this.getTouchDistance(e.touches[0], e.touches[1]);
          const delta = distance - lastDistance;
          lastDistance = distance;

          const currentZoom = this.instance!.getZoom();
          const zoomChange = delta * 0.01;
          this.setZoom(currentZoom + zoomChange);
        }
      };

      const touchEndHandler = () => {
        lastDistance = null;
      };

      element.addEventListener('touchstart', touchStartHandler);
      element.addEventListener('touchmove', touchMoveHandler, { passive: false });
      element.addEventListener('touchend', touchEndHandler);

      this.cleanupFns.push(() => {
        element.removeEventListener('touchstart', touchStartHandler);
        element.removeEventListener('touchmove', touchMoveHandler);
        element.removeEventListener('touchend', touchEndHandler);
      });
    }
  }

  /**
   * Handle mouse wheel
   */
  private handleWheel(e: WheelEvent): void {
    if (!this.instance) return;

    e.preventDefault();

    const delta = -e.deltaY * 0.001;
    const currentZoom = this.instance.getZoom();
    const newZoom = currentZoom * (1 + delta);

    if (this.config.smooth) {
      this.smoothZoomTo(newZoom);
    } else {
      this.setZoom(newZoom);
    }
  }

  /**
   * Get distance between two touches
   */
  private getTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Set zoom level
   */
  private setZoom(zoom: number): void {
    if (!this.instance) return;

    const clampedZoom = clamp(zoom, this.config.min!, this.config.max!);
    this.instance.setZoom(clampedZoom);
  }

  /**
   * Smooth zoom to target
   */
  private smoothZoomTo(targetZoom: number): void {
    if (!this.instance) return;

    this.zoomTarget = clamp(targetZoom, this.config.min!, this.config.max!);

    if (!this.isZooming) {
      this.isZooming = true;
      this.zoomStartTime = Date.now();
      this.animateZoom();
    }
  }

  /**
   * Animate zoom
   */
  private animateZoom(): void {
    if (!this.instance || !this.isZooming || this.zoomTarget === null) return;

    const currentZoom = this.instance.getZoom();
    const diff = this.zoomTarget - currentZoom;

    // Check if close enough
    if (Math.abs(diff) < 0.001) {
      this.instance.setZoom(this.zoomTarget);
      this.isZooming = false;
      this.zoomTarget = null;
      return;
    }

    // Smooth interpolation
    const newZoom = currentZoom + diff * 0.2;
    this.instance.setZoom(newZoom);

    // Continue animation
    this.animationFrame = requestAnimationFrame(() => this.animateZoom());
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    if (!this.instance) return;
    const currentZoom = this.instance.getZoom();
    const newZoom = currentZoom + this.config.step!;

    if (this.config.smooth) {
      this.smoothZoomTo(newZoom);
    } else {
      this.setZoom(newZoom);
    }
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    if (!this.instance) return;
    const currentZoom = this.instance.getZoom();
    const newZoom = currentZoom - this.config.step!;

    if (this.config.smooth) {
      this.smoothZoomTo(newZoom);
    } else {
      this.setZoom(newZoom);
    }
  }

  /**
   * Reset zoom
   */
  reset(): void {
    if (this.config.smooth) {
      this.smoothZoomTo(1);
    } else {
      this.setZoom(1);
    }
  }

  /**
   * Destroy controller
   */
  destroy(): void {
    // Cancel animation
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Cleanup event listeners
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];

    this.instance = null;
    this.element = null;
    this.isZooming = false;
    this.zoomTarget = null;
  }
}

