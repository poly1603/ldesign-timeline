/**
 * Node Animation
 */

export class NodeAnimation {
  static pulse(element: HTMLElement, duration: number = 1000): void {
    element.style.animation = `pulse ${duration}ms ease-in-out infinite`;
  }
}

