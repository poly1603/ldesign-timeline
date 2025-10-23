/**
 * @ldesign/timeline - Type Definitions
 */

/**
 * Render type
 */
export type RenderType = 'svg' | 'canvas';

/**
 * Timeline orientation
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Time scale unit
 */
export enum TimeScale {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
}

/**
 * Node shape type
 */
export type NodeShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'icon' | 'image';

/**
 * Text alignment
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Animation easing function
 */
export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'elastic' | 'bounce';

/**
 * Event group
 */
export interface EventGroup {
  /** Group ID */
  id: string;

  /** Group name */
  name: string;

  /** Group color */
  color?: string;

  /** Group visibility */
  visible?: boolean;
}

/**
 * Timeline event node
 */
export interface TimelineEvent {
  /** Event ID */
  id: string;

  /** Event title */
  title: string;

  /** Event description */
  description?: string;

  /** Event timestamp */
  timestamp: number | Date;

  /** Event end time (for range events) */
  endTime?: number | Date;

  /** Event color */
  color?: string;

  /** Node shape */
  shape?: NodeShape;

  /** Node icon (class name or URL) */
  icon?: string;

  /** Node image URL */
  image?: string;

  /** Group ID */
  groupId?: string;

  /** Custom data */
  data?: Record<string, any>;

  /** Whether event is visible */
  visible?: boolean;

  /** Custom CSS class */
  className?: string;
}

/**
 * Node style configuration
 */
export interface NodeStyle {
  /** Node size in pixels */
  size?: number;

  /** Node color */
  color?: string;

  /** Node border width */
  borderWidth?: number;

  /** Node border color */
  borderColor?: string;

  /** Node shadow */
  shadow?: boolean;

  /** Node shadow color */
  shadowColor?: string;

  /** Node shadow blur */
  shadowBlur?: number;

  /** Node opacity */
  opacity?: number;
}

/**
 * Line style configuration
 */
export interface LineStyle {
  /** Line width */
  width?: number;

  /** Line color */
  color?: string;

  /** Line style */
  style?: 'solid' | 'dashed' | 'dotted';

  /** Line opacity */
  opacity?: number;
}

/**
 * Grid configuration
 */
export interface GridConfig {
  /** Show grid */
  show?: boolean;

  /** Grid line color */
  color?: string;

  /** Grid line width */
  lineWidth?: number;

  /** Grid line style */
  style?: 'solid' | 'dashed' | 'dotted';

  /** Grid opacity */
  opacity?: number;
}

/**
 * Scale configuration
 */
export interface ScaleConfig {
  /** Time scale unit */
  unit?: TimeScale;

  /** Auto scale */
  auto?: boolean;

  /** Scale format string */
  format?: string;

  /** Show scale labels */
  showLabels?: boolean;

  /** Scale label font size */
  fontSize?: number;

  /** Scale label color */
  color?: string;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Enable animations */
  enabled?: boolean;

  /** Entrance animation */
  entrance?: boolean;

  /** Entrance animation type */
  entranceType?: 'fade' | 'slide' | 'zoom' | 'bounce';

  /** Entrance animation duration (ms) */
  entranceDuration?: number;

  /** Entrance animation delay per item (ms) */
  entranceDelay?: number;

  /** Scroll animation */
  scroll?: boolean;

  /** Scroll parallax factor */
  parallax?: number;

  /** Node pulse animation */
  pulse?: boolean;

  /** Node pulse duration (ms) */
  pulseDuration?: number;

  /** Line animation */
  lineAnimation?: boolean;

  /** Line animation duration (ms) */
  lineAnimationDuration?: number;

  /** Easing function */
  easing?: EasingFunction;

  /** Custom easing function */
  customEasing?: (t: number) => number;
}

/**
 * Zoom configuration
 */
export interface ZoomConfig {
  /** Enable zoom */
  enabled?: boolean;

  /** Minimum zoom level */
  min?: number;

  /** Maximum zoom level */
  max?: number;

  /** Zoom step */
  step?: number;

  /** Smooth zoom animation */
  smooth?: boolean;

  /** Mouse wheel zoom */
  wheel?: boolean;

  /** Pinch zoom (touch) */
  pinch?: boolean;
}

/**
 * Pan configuration
 */
export interface PanConfig {
  /** Enable pan */
  enabled?: boolean;

  /** Inertia scrolling */
  inertia?: boolean;

  /** Inertia friction */
  friction?: number;

  /** Boundary detection */
  boundary?: boolean;

  /** Touch pan */
  touch?: boolean;
}

/**
 * Drag configuration
 */
export interface DragConfig {
  /** Enable drag */
  enabled?: boolean;

  /** Time snap */
  snap?: boolean;

  /** Snap interval (ms) */
  snapInterval?: number;

  /** Show drag preview */
  preview?: boolean;

  /** Drag callback */
  onDrag?: (event: TimelineEvent, newTime: number) => void;

  /** Drag end callback */
  onDragEnd?: (event: TimelineEvent, newTime: number) => void;
}

/**
 * Selection configuration
 */
export interface SelectionConfig {
  /** Enable selection */
  enabled?: boolean;

  /** Multi-select */
  multi?: boolean;

  /** Box select */
  box?: boolean;

  /** Keyboard navigation */
  keyboard?: boolean;

  /** Selection callback */
  onSelect?: (events: TimelineEvent[]) => void;
}

/**
 * Keyboard shortcuts
 */
export interface KeyboardConfig {
  /** Enable keyboard shortcuts */
  enabled?: boolean;

  /** Custom key bindings */
  bindings?: Record<string, () => void>;
}

/**
 * 3D configuration
 */
export interface ThreeConfig {
  /** Enable 3D rendering */
  enabled?: boolean;

  /** Camera position */
  cameraPosition?: { x: number; y: number; z: number };

  /** Camera rotation */
  cameraRotation?: { x: number; y: number; z: number };

  /** Enable camera controls */
  controls?: boolean;

  /** Node depth */
  depth?: number;

  /** Node 3D shape */
  shape3d?: 'sphere' | 'cube' | 'cylinder' | 'cone';

  /** Lighting */
  lighting?: boolean;

  /** Shadow */
  shadow?: boolean;

  /** Antialias */
  antialias?: boolean;
}

/**
 * Export configuration
 */
export interface ExportConfig {
  /** Export format */
  format?: 'png' | 'jpeg' | 'svg' | 'pdf';

  /** Export quality (0-1) */
  quality?: number;

  /** Export background */
  background?: string;

  /** Export scale */
  scale?: number;
}

/**
 * Realtime configuration
 */
export interface RealtimeConfig {
  /** Enable realtime updates */
  enabled?: boolean;

  /** WebSocket URL */
  url?: string;

  /** Reconnect attempts */
  reconnectAttempts?: number;

  /** Reconnect interval (ms) */
  reconnectInterval?: number;

  /** Buffer size */
  bufferSize?: number;
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  /** Template name */
  name?: string;

  /** Custom templates */
  custom?: Record<string, Partial<TimelineConfig>>;
}

/**
 * Tooltip configuration
 */
export interface TooltipConfig {
  /** Show tooltip */
  show?: boolean;

  /** Custom tooltip renderer */
  render?: (event: TimelineEvent) => string | HTMLElement;

  /** Tooltip delay (ms) */
  delay?: number;
}

/**
 * Today line configuration
 */
export interface TodayLineConfig {
  /** Show today line */
  show?: boolean;

  /** Today line color */
  color?: string;

  /** Today line width */
  width?: number;

  /** Today line style */
  style?: 'solid' | 'dashed' | 'dotted';
}

/**
 * Timeline configuration
 */
export interface TimelineConfig {
  /** Timeline container element */
  container?: HTMLElement;

  /** Timeline events */
  events: TimelineEvent[];

  /** Event groups */
  groups?: EventGroup[];

  /** Timeline orientation */
  orientation?: Orientation;

  /** Render type */
  renderType?: RenderType;

  /** Timeline width */
  width?: number;

  /** Timeline height */
  height?: number;

  /** Timeline margin */
  margin?: { top: number; right: number; bottom: number; left: number };

  /** Background color */
  background?: string;

  /** Font family */
  fontFamily?: string;

  /** Font size */
  fontSize?: number;

  /** Text color */
  textColor?: string;

  /** Node style */
  nodeStyle?: NodeStyle;

  /** Line style */
  lineStyle?: LineStyle;

  /** Grid configuration */
  grid?: GridConfig;

  /** Scale configuration */
  scale?: ScaleConfig;

  /** Animation configuration */
  animation?: AnimationConfig;

  /** Zoom configuration */
  zoom?: ZoomConfig;

  /** Pan configuration */
  pan?: PanConfig;

  /** Drag configuration */
  drag?: DragConfig;

  /** Selection configuration */
  selection?: SelectionConfig;

  /** Keyboard configuration */
  keyboard?: KeyboardConfig;

  /** Tooltip configuration */
  tooltip?: TooltipConfig;

  /** Today line configuration */
  todayLine?: TodayLineConfig;

  /** 3D configuration */
  three?: ThreeConfig;

  /** Export configuration */
  export?: ExportConfig;

  /** Realtime configuration */
  realtime?: RealtimeConfig;

  /** Template configuration */
  template?: TemplateConfig;

  /** Custom CSS class */
  className?: string;

  /** Custom styles */
  style?: Record<string, string>;

  /** Event click callback */
  onClick?: (event: TimelineEvent) => void;

  /** Event double click callback */
  onDblClick?: (event: TimelineEvent) => void;

  /** Event hover callback */
  onHover?: (event: TimelineEvent | null) => void;

  /** Time range change callback */
  onRangeChange?: (start: number, end: number) => void;

  /** Zoom change callback */
  onZoomChange?: (zoom: number) => void;
}

/**
 * Render options (internal)
 */
export interface RenderOptions {
  renderType: RenderType;
  orientation: Orientation;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  background: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  nodeStyle: Required<NodeStyle>;
  lineStyle: Required<LineStyle>;
  grid: Required<GridConfig>;
  scale: Required<ScaleConfig>;
  todayLine: Required<TodayLineConfig>;
}

/**
 * Layout result
 */
export interface LayoutResult {
  /** Node positions */
  positions: Map<string, { x: number; y: number }>;

  /** Timeline bounds */
  bounds: { minTime: number; maxTime: number; width: number; height: number };

  /** Visible events */
  visibleEvents: TimelineEvent[];
}

/**
 * Timeline instance interface
 */
export interface TimelineInstance {
  /**
   * Update timeline configuration
   */
  update(config: Partial<TimelineConfig>): Promise<void>;

  /**
   * Add event
   */
  addEvent(event: TimelineEvent): void;

  /**
   * Remove event
   */
  removeEvent(eventId: string): void;

  /**
   * Update event
   */
  updateEvent(eventId: string, event: Partial<TimelineEvent>): void;

  /**
   * Get event by ID
   */
  getEvent(eventId: string): TimelineEvent | undefined;

  /**
   * Get all events
   */
  getEvents(): TimelineEvent[];

  /**
   * Filter events
   */
  filterEvents(predicate: (event: TimelineEvent) => boolean): TimelineEvent[];

  /**
   * Add group
   */
  addGroup(group: EventGroup): void;

  /**
   * Remove group
   */
  removeGroup(groupId: string): void;

  /**
   * Update group
   */
  updateGroup(groupId: string, group: Partial<EventGroup>): void;

  /**
   * Zoom in
   */
  zoomIn(): void;

  /**
   * Zoom out
   */
  zoomOut();

  /**
   * Set zoom level
   */
  setZoom(level: number): void;

  /**
   * Get zoom level
   */
  getZoom(): number;

  /**
   * Pan to position
   */
  panTo(x: number, y: number): void;

  /**
   * Center on event
   */
  centerOn(eventId: string): void;

  /**
   * Fit to view
   */
  fit(): void;

  /**
   * Get selected events
   */
  getSelection(): TimelineEvent[];

  /**
   * Set selected events
   */
  setSelection(eventIds: string[]): void;

  /**
   * Clear selection
   */
  clearSelection(): void;

  /**
   * Get data URL (canvas only)
   */
  toDataURL(format?: 'png' | 'jpeg', quality?: number): string;

  /**
   * Get SVG string (SVG only)
   */
  toSVGString(): string;

  /**
   * Export timeline
   */
  export(config?: ExportConfig): Promise<Blob | string>;

  /**
   * Download timeline
   */
  download(fileName?: string, format?: 'png' | 'jpeg' | 'svg' | 'pdf'): void;

  /**
   * Play animation
   */
  play(): void;

  /**
   * Pause animation
   */
  pause(): void;

  /**
   * Stop animation
   */
  stop(): void;

  /**
   * Destroy timeline instance
   */
  destroy(): void;

  /**
   * Get the rendered element
   */
  getElement(): HTMLCanvasElement | SVGSVGElement | null;

  /**
   * Get container element
   */
  getContainer(): HTMLElement | null;
}

/**
 * Renderer interface
 */
export interface Renderer {
  /**
   * Render timeline
   */
  render(events: TimelineEvent[], layout: LayoutResult, options: RenderOptions): void;

  /**
   * Get rendered element
   */
  getElement(): HTMLCanvasElement | SVGSVGElement | null;

  /**
   * Update view transform
   */
  updateTransform(zoom: number, panX: number, panY: number): void;

  /**
   * Highlight event
   */
  highlightEvent(eventId: string | null): void;

  /**
   * Clear renderer
   */
  clear(): void;

  /**
   * Destroy renderer
   */
  destroy(): void;
}

/**
 * Layout engine interface
 */
export interface LayoutEngine {
  /**
   * Calculate layout
   */
  layout(events: TimelineEvent[], options: RenderOptions): LayoutResult;

  /**
   * Get event at position
   */
  getEventAtPosition(x: number, y: number, layout: LayoutResult): TimelineEvent | null;
}

/**
 * Controller interface
 */
export interface Controller {
  /**
   * Initialize controller
   */
  init(element: HTMLElement, instance: TimelineInstance): void;

  /**
   * Destroy controller
   */
  destroy(): void;
}

/**
 * Plugin interface
 */
export interface Plugin {
  /**
   * Plugin name
   */
  name: string;

  /**
   * Plugin version
   */
  version?: string;

  /**
   * Install plugin
   */
  install(instance: TimelineInstance): void;

  /**
   * Uninstall plugin
   */
  uninstall(): void;
}

/**
 * Animation frame data
 */
export interface AnimationFrame {
  /** Current time */
  time: number;

  /** Progress (0-1) */
  progress: number;

  /** Delta time */
  delta: number;

  /** Is running */
  running: boolean;
}

/**
 * Easing functions type
 */
export type EasingFunctions = Record<EasingFunction, (t: number) => number>;

/**
 * Point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Rectangle
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * View transform
 */
export interface ViewTransform {
  zoom: number;
  panX: number;
  panY: number;
}

