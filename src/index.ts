/**
 * @ldesign/timeline - 时间轴
 */
export class Timeline {
  constructor(private container: HTMLElement) { }
  render() { console.info('Timeline rendering') }
}
export function createTimeline(container: HTMLElement) { return new Timeline(container) }






