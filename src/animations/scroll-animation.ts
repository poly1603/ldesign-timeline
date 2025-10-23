/**
 * Scroll Animation
 */

export class ScrollAnimation {
  static parallax(scrollY: number, factor: number = 0.5): number {
    return scrollY * factor;
  }
}

