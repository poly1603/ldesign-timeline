/**
 * React Timeline Component
 */

import React, { CSSProperties } from 'react';
import { TimelineConfig, TimelineEvent } from '../../../types';
import { useTimeline } from '../hooks/useTimeline';

export interface TimelineProps {
  events: TimelineEvent[];
  orientation?: 'horizontal' | 'vertical';
  renderType?: 'canvas' | 'svg';
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  onReady?: (instance: any) => void;
  onError?: (error: Error) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  orientation = 'horizontal',
  renderType = 'canvas',
  width = 800,
  height = 600,
  className = '',
  style = {},
  onReady,
  onError,
}) => {
  // Timeline configuration
  const config: TimelineConfig = {
    events,
    orientation,
    renderType,
    width,
    height,
  };

  // Use timeline hook
  const { containerRef, instance, error } = useTimeline(config);

  // Handle ready event
  React.useEffect(() => {
    if (instance && onReady) {
      onReady(instance);
    }
  }, [instance, onReady]);

  // Handle error event
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Container style
  const containerStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={`ldesign-timeline ${className}`}
      style={containerStyle}
    />
  );
};

export default Timeline;

