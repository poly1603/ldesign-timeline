/**
 * Entrance Animation
 */

export class EntranceAnimation {
  static fade(element: HTMLElement, duration: number = 600): void {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-out`;
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  static slide(element: HTMLElement, duration: number = 600): void {
    element.style.transform = 'translateY(-20px)';
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease-out`;
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    });
  }
}

