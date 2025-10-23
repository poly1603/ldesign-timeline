/**
 * Vue composable for timeline
 */

import { ref, watch, onMounted, onUnmounted, Ref } from 'vue';
import { TimelineConfig, TimelineInstance, TimelineEvent } from '../../../types';
import { createTimeline } from '../../../core/timeline-generator';

/**
 * Use Timeline composable
 */
export function useTimeline(config: Ref<TimelineConfig>) {
  const container = ref<HTMLElement | null>(null);
  const instance = ref<TimelineInstance | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(false);

  /**
   * Generate timeline
   */
  const generate = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // Destroy previous instance
      if (instance.value) {
        instance.value.destroy();
        instance.value = null;
      }

      // Create new instance
      if (container.value) {
        instance.value = createTimeline({
          ...config.value,
          container: container.value,
        });
      }
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update timeline
   */
  const update = async (newConfig: Partial<TimelineConfig>) => {
    if (instance.value) {
      try {
        await instance.value.update(newConfig);
      } catch (err) {
        error.value = err as Error;
      }
    }
  };

  /**
   * Add event
   */
  const addEvent = (event: TimelineEvent) => {
    if (instance.value) {
      instance.value.addEvent(event);
    }
  };

  /**
   * Remove event
   */
  const removeEvent = (eventId: string) => {
    if (instance.value) {
      instance.value.removeEvent(eventId);
    }
  };

  /**
   * Zoom in
   */
  const zoomIn = () => {
    if (instance.value) {
      instance.value.zoomIn();
    }
  };

  /**
   * Zoom out
   */
  const zoomOut = () => {
    if (instance.value) {
      instance.value.zoomOut();
    }
  };

  /**
   * Fit to view
   */
  const fit = () => {
    if (instance.value) {
      instance.value.fit();
    }
  };

  /**
   * Download timeline
   */
  const download = (fileName?: string, format?: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    if (instance.value) {
      instance.value.download(fileName, format);
    }
  };

  /**
   * Get data URL
   */
  const toDataURL = (format?: 'png' | 'jpeg', quality?: number): string => {
    if (instance.value) {
      return instance.value.toDataURL(format, quality);
    }
    return '';
  };

  /**
   * Get SVG string
   */
  const toSVGString = (): string => {
    if (instance.value) {
      return instance.value.toSVGString();
    }
    return '';
  };

  // Watch config changes
  watch(config, () => {
    if (instance.value) {
      update(config.value);
    }
  }, { deep: true });

  // Cleanup on unmount
  onUnmounted(() => {
    if (instance.value) {
      instance.value.destroy();
      instance.value = null;
    }
  });

  return {
    container,
    instance,
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

