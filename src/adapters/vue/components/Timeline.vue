<template>
  <div ref="timelineRef" class="ldesign-timeline" :class="className" :style="customStyle"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { TimelineConfig, TimelineEvent } from '../../../types';
import { useTimeline } from '../composables/useTimeline';

/**
 * Props
 */
const props = withDefaults(defineProps<{
  events: TimelineEvent[];
  orientation?: 'horizontal' | 'vertical';
  renderType?: 'canvas' | 'svg';
  width?: number;
  height?: number;
  className?: string;
  style?: Record<string, string>;
}>(), {
  orientation: 'horizontal',
  renderType: 'canvas',
  width: 800,
  height: 600,
  className: '',
  style: () => ({}),
});

/**
 * Emits
 */
const emit = defineEmits<{
  ready: [instance: any];
  error: [error: Error];
}>();

// Timeline configuration
const config = computed<TimelineConfig>(() => ({
  events: props.events,
  orientation: props.orientation,
  renderType: props.renderType,
  width: props.width,
  height: props.height,
}));

// Use timeline composable
const { container, instance, error, generate } = useTimeline(ref(config.value));

// Ref for container
const timelineRef = ref<HTMLElement | null>(null);

// Custom style
const customStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  ...props.style,
}));

// Initialize
onMounted(async () => {
  container.value = timelineRef.value;
  await generate();
  if (instance.value) {
    emit('ready', instance.value);
  }
});

// Watch errors
watch(error, (err) => {
  if (err) {
    emit('error', err);
  }
});

// Expose instance
defineExpose({
  instance,
});
</script>

<style scoped>
.ldesign-timeline {
  position: relative;
  overflow: hidden;
}
</style>
