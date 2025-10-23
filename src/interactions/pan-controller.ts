/**
 * Pan Controller
 */

import { TimelineInstance, PanConfig, Controller } from '../types';
import { getMousePosition } from '../utils';

/**
 * Pan Controller
 */
export class PanController implements Controller {
  private instance: TimelineInstance | null = null;
  private element: HTMLElement | null = null;
  private config: PanConfig;

  private isPanning: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;

  // Inertia
  private velocityX: number = 0;
  private velocityY: number = 0;
  private lastMoveTime: number = 0;
  private animationFrame: number | null = null;

  // Event listeners cleanup
  private cleanupFns: Array<() => void> = [];

  constructor(config: PanConfig = {}) {
    this.config = {
      enabled: true,
      inertia: true,
      friction: 0.95,
      boundary: true,
      touch: true,
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

    // Mouse pan
    const mouseDownHandler = (e: MouseEvent) => this.handleMouseDown(e);
    const mouseMoveHandler = (e: MouseEvent) => this.handleMouseMove(e);
    const mouseUpHandler = (e: MouseEvent) => this.handleMouseUp(e);

    element.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    this.cleanupFns.push(() => {
      element.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    });

    // Touch pan
    if (this.config.touch) {
      const touchStartHandler = (e: TouchEvent) => this.handleTouchStart(e);
      const touchMoveHandler = (e: TouchEvent) => this.handleTouchMove(e);
      const touchEndHandler = (e: TouchEvent) => this.handleTouchEnd(e);

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
   * Handle mouse down
   */
  private handleMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return; // Only left click

    this.isPanning = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.lastMoveTime = Date.now();

    // Cancel inertia animation
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.element) {
      this.element.style.cursor = 'grabbing';
    }
  }

  /**
   * Handle mouse move
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.isPanning || !this.instance) return;

    const deltaX = e.clientX - this.currentX;
    const deltaY = e.clientY - this.currentY;

    // Calculate velocity for inertia
    const now = Date.now();
    const dt = Math.max(1, now - this.lastMoveTime);
    this.velocityX = deltaX / dt;
    this.velocityY = deltaY / dt;
    this.lastMoveTime = now;

    this.currentX = e.clientX;
    this.currentY = e.clientY;

    // Apply pan
    // Note: This is a simplified implementation
    // In a real scenario, we'd get current pan values and add deltas
    this.instance.panTo(deltaX, deltaY);
  }

  /**
   * Handle mouse up
   */
  private handleMouseUp(e: MouseEvent): void {
    if (!this.isPanning) return;

    this.isPanning = false;

    if (this.element) {
      this.element.style.cursor = '';
    }

    // Apply inertia
    if (this.config.inertia && (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1)) {
      this.applyInertia();
    }
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.isPanning = true;
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.currentX = touch.clientX;
      this.currentY = touch.clientY;
      this.velocityX = 0;
      this.velocityY = 0;
      this.lastMoveTime = Date.now();

      // Cancel inertia animation
      if (this.animationFrame !== null) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }
  }

  /**
   * Handle touch move
   */
  private handleTouchMove(e: TouchEvent): void {
    if (!this.isPanning || !this.instance || e.touches.length !== 1) return;

    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - this.currentX;
    const deltaY = touch.clientY - this.currentY;

    // Calculate velocity for inertia
    const now = Date.now();
    const dt = Math.max(1, now - this.lastMoveTime);
    this.velocityX = deltaX / dt;
    this.velocityY = deltaY / dt;
    this.lastMoveTime = now;

    this.currentX = touch.clientX;
    this.currentY = touch.clientY;

    // Apply pan
    this.instance.panTo(deltaX, deltaY);
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(e: TouchEvent): void {
    if (!this.isPanning) return;

    this.isPanning = false;

    // Apply inertia
    if (this.config.inertia && (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1)) {
      this.applyInertia();
    }
  }

  /**
   * Apply inertia scrolling
   */
  private applyInertia(): void {
    if (!this.instance) return;

    const animate = () => {
      // Apply friction
      this.velocityX *= this.config.friction!;
      this.velocityY *= this.config.friction!;

      // Stop if velocity is very small
      if (Math.abs(this.velocityX) < 0.01 && Math.abs(this.velocityY) < 0.01) {
        this.animationFrame = null;
        return;
      }

      // Apply pan
      const deltaX = this.velocityX * 16; // Assume 60fps
      const deltaY = this.velocityY * 16;
      this.instance!.panTo(deltaX, deltaY);

      // Continue animation
      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Pan to position
   */
  panTo(x: number, y: number): void {
    if (!this.instance) return;
    this.instance.panTo(x, y);
  }

  /**
   * Reset pan
   */
  reset(): void {
    if (!this.instance) return;
    this.instance.panTo(0, 0);
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
    this.isPanning = false;
  }
}

