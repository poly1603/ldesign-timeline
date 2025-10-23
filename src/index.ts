/**
 * @ldesign/timeline - 时间轴组件
 * 垂直/水平布局、自定义节点、动画效果、时间刻度、缩放/拖拽
 */

// Export types
export * from './types';

// Export core
export { TimelineGenerator, createTimeline, generateTimeline } from './core/timeline-generator';
export { EventManager } from './core/event-manager';
export { ScaleCalculator } from './core/scale-calculator';
export type { ScaleTick } from './core/scale-calculator';

// Export renderers
export { BaseRenderer } from './renderers/base-renderer';
export { CanvasRenderer } from './renderers/canvas-renderer';
export { SVGRenderer } from './renderers/svg-renderer';

// Export layouts
export { HorizontalLayout } from './layouts/horizontal-layout';
export { VerticalLayout } from './layouts/vertical-layout';
export { LayoutManager } from './layouts/layout-manager';

// Export interactions
export { ZoomController } from './interactions/zoom-controller';
export { PanController } from './interactions/pan-controller';
export { DragController } from './interactions/drag-controller';
export { SelectionController } from './interactions/selection-controller';
export { KeyboardHandler } from './interactions/keyboard-handler';

// Export animations
export { AnimationEngine } from './animations/animation-engine';
export { EntranceAnimation } from './animations/entrance-animation';
export { ScrollAnimation } from './animations/scroll-animation';
export { NodeAnimation } from './animations/node-animation';
export { LineAnimation } from './animations/line-animation';

// Export plugins
export { ThreePlugin } from './plugins/three-plugin';
export { ExportPlugin } from './plugins/export-plugin';
export { RealtimePlugin } from './plugins/realtime-plugin';
export { TemplatePlugin } from './plugins/template-plugin';

// Export utilities
export * from './utils';

// Default export
export default {
  TimelineGenerator,
  createTimeline,
  generateTimeline,
};
