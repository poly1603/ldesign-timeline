/**
 * React hook for timeline
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { TimelineConfig, TimelineInstance, TimelineEvent } from '../../../types';
import { createTimeline } from '../../../core/timeline-generator';

/**
 * Use Timeline hook
 */
export function useTimeline(config: TimelineConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<TimelineInstance | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generate timeline
   */
  const generate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Destroy previous instance
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }

      // Create new instance
      if (containerRef.current) {
        instanceRef.current = createTimeline({
          ...config,
          container: containerRef.current,
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  /**
   * Update timeline
   */
  const update = useCallback(async (newConfig: Partial<TimelineConfig>) => {
    if (instanceRef.current) {
      try {
        await instanceRef.current.update(newConfig);
      } catch (err) {
        setError(err as Error);
      }
    }
  }, []);

  /**
   * Add event
   */
  const addEvent = useCallback((event: TimelineEvent) => {
    if (instanceRef.current) {
      instanceRef.current.addEvent(event);
    }
  }, []);

  /**
   * Remove event
   */
  const removeEvent = useCallback((eventId: string) => {
    if (instanceRef.current) {
      instanceRef.current.removeEvent(eventId);
    }
  }, []);

  /**
   * Zoom in
   */
  const zoomIn = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.zoomIn();
    }
  }, []);

  /**
   * Zoom out
   */
  const zoomOut = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.zoomOut();
    }
  }, []);

  /**
   * Fit to view
   */
  const fit = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.fit();
    }
  }, []);

  /**
   * Download timeline
   */
  const download = useCallback((fileName?: string, format?: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    if (instanceRef.current) {
      instanceRef.current.download(fileName, format);
    }
  }, []);

  /**
   * Get data URL
   */
  const toDataURL = useCallback((format?: 'png' | 'jpeg', quality?: number): string => {
    if (instanceRef.current) {
      return instanceRef.current.toDataURL(format, quality);
    }
    return '';
  }, []);

  /**
   * Get SVG string
   */
  const toSVGString = useCallback((): string => {
    if (instanceRef.current) {
      return instanceRef.current.toSVGString();
    }
    return '';
  }, []);

  // Generate on mount and config change
  useEffect(() => {
    generate();
  }, [generate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return {
    containerRef,
    instance: instanceRef.current,
    error,
    isLoading,
    generate,
    update,
    addEvent,
    removeEvent,
    zoomIn,
    zoomOut,
    fit,
    download,
    toDataURL,
    toSVGString,
  };
}

