/**
 * Line Animation
 */

export class LineAnimation {
  static draw(element: SVGPathElement, duration: number = 1000): void {
    const length = element.getTotalLength();
    element.style.strokeDasharray = `${length}`;
    element.style.strokeDashoffset = `${length}`;
    element.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
    requestAnimationFrame(() => {
      element.style.strokeDashoffset = '0';
    });
  }
}

