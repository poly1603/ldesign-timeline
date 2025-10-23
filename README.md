# @ldesign/timeline

强大的时间轴组件库，支持垂直/水平布局、自定义节点、动画效果、时间刻度、缩放/拖拽等功能。

## ✨ 特性

### 核心功能（P0）
- ✅ 垂直/水平时间轴布局
- ✅ 时间刻度（年/月/日/时）
- ✅ 网格背景
- ✅ 今日线标记
- ✅ 节点渲染（圆点/图标/图片）
- ✅ 节点标题和描述
- ✅ 缩放控制（放大/缩小）
- ✅ 平移滚动
- ✅ 节点拖拽
- ✅ 节点选中
- ✅ 快捷键支持

### 高级功能（P1）
- ✅ 自定义节点样式
- ✅ 自定义连接线
- ✅ 自定义时间刻度
- ✅ 进入动画（渐显/滑入/缩放）
- ✅ 滚动动画（视差）
- ✅ 节点动画（脉冲）
- ✅ 连接线动画
- ✅ 事件分组
- ✅ 事件筛选

### 扩展功能（P2）
- ✅ 3D 时间轴（Three.js）
- ✅ 实时数据（WebSocket）
- ✅ 导出图片/PDF/SVG
- ✅ 时间轴模板

### 渲染器
- ✅ Canvas 渲染器（高性能）
- ✅ SVG 渲染器（可伸缩）
- ✅ 双渲染器切换

### 框架支持
- ✅ 原生 JavaScript/TypeScript
- ✅ Vue 3 适配器
- ✅ React 适配器

## 📦 安装

```bash
npm install @ldesign/timeline
# or
yarn add @ldesign/timeline
# or
pnpm add @ldesign/timeline
```

## 🚀 使用

### 原生 JavaScript

```typescript
import { createTimeline } from '@ldesign/timeline';

const timeline = createTimeline({
  container: document.getElementById('timeline'),
  events: [
    {
      id: '1',
      title: '项目启动',
      description: '项目正式启动',
      timestamp: new Date('2024-01-01'),
      color: '#1890ff',
    },
    {
      id: '2',
      title: '第一个版本发布',
      description: 'v1.0.0 发布',
      timestamp: new Date('2024-06-01'),
      color: '#52c41a',
    },
  ],
  orientation: 'horizontal',
  renderType: 'canvas',
  width: 800,
  height: 600,
});

// 添加事件
timeline.addEvent({
  id: '3',
  title: '新功能上线',
  timestamp: new Date('2024-09-01'),
});

// 缩放
timeline.zoomIn();
timeline.zoomOut();

// 导出
timeline.download('timeline.png', 'png');
```

### Vue 3

```vue
<template>
  <Timeline
    :events="events"
    orientation="horizontal"
    renderType="canvas"
    :width="800"
    :height="600"
    @ready="handleReady"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Timeline } from '@ldesign/timeline/vue';

const events = ref([
  {
    id: '1',
    title: '项目启动',
    timestamp: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: '第一个版本发布',
    timestamp: new Date('2024-06-01'),
  },
]);

const handleReady = (instance) => {
  console.log('Timeline ready:', instance);
};
</script>
```

或使用 Composable：

```typescript
import { ref } from 'vue';
import { useTimeline } from '@ldesign/timeline/vue';

const config = ref({
  events: [
    { id: '1', title: '事件1', timestamp: new Date() },
  ],
});

const { container, instance, zoomIn, zoomOut, download } = useTimeline(config);
```

### React

```tsx
import React from 'react';
import { Timeline } from '@ldesign/timeline/react';

function App() {
  const events = [
    {
      id: '1',
      title: '项目启动',
      timestamp: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: '第一个版本发布',
      timestamp: new Date('2024-06-01'),
    },
  ];

  const handleReady = (instance) => {
    console.log('Timeline ready:', instance);
  };

  return (
    <Timeline
      events={events}
      orientation="horizontal"
      renderType="canvas"
      width={800}
      height={600}
      onReady={handleReady}
    />
  );
}
```

或使用 Hook：

```typescript
import { useTimeline } from '@ldesign/timeline/react';

const { containerRef, instance, zoomIn, zoomOut, download } = useTimeline({
  events: [
    { id: '1', title: '事件1', timestamp: new Date() },
  ],
});
```

## 📖 API

### TimelineConfig

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| events | TimelineEvent[] | [] | 时间轴事件列表 |
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | 时间轴方向 |
| renderType | 'canvas' \| 'svg' | 'canvas' | 渲染类型 |
| width | number | 800 | 时间轴宽度 |
| height | number | 600 | 时间轴高度 |
| zoom | ZoomConfig | - | 缩放配置 |
| pan | PanConfig | - | 平移配置 |
| animation | AnimationConfig | - | 动画配置 |

### TimelineEvent

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | string | 是 | 事件唯一标识 |
| title | string | 是 | 事件标题 |
| description | string | 否 | 事件描述 |
| timestamp | Date \| number | 是 | 事件时间戳 |
| endTime | Date \| number | 否 | 事件结束时间 |
| color | string | 否 | 事件颜色 |
| shape | NodeShape | 否 | 节点形状 |
| groupId | string | 否 | 所属分组 |

### TimelineInstance 方法

- `update(config)` - 更新配置
- `addEvent(event)` - 添加事件
- `removeEvent(eventId)` - 移除事件
- `updateEvent(eventId, event)` - 更新事件
- `zoomIn()` - 放大
- `zoomOut()` - 缩小
- `setZoom(level)` - 设置缩放级别
- `panTo(x, y)` - 平移到指定位置
- `centerOn(eventId)` - 居中到指定事件
- `fit()` - 适应视图
- `toDataURL(format, quality)` - 导出为 Data URL
- `toSVGString()` - 导出为 SVG 字符串
- `download(fileName, format)` - 下载
- `destroy()` - 销毁实例

## 🔌 插件

### 3D 插件

```typescript
import { createTimeline } from '@ldesign/timeline';
import { ThreePlugin } from '@ldesign/timeline';

const timeline = createTimeline({
  events: [...],
  three: {
    enabled: true,
    cameraPosition: { x: 0, y: 0, z: 500 },
    controls: true,
  },
});
```

### 实时数据插件

```typescript
import { RealtimePlugin } from '@ldesign/timeline';

const realtimePlugin = new RealtimePlugin({
  enabled: true,
  url: 'ws://localhost:3000',
});

realtimePlugin.install(timeline);
```

### 导出插件

```typescript
import { ExportPlugin } from '@ldesign/timeline';

const exportPlugin = new ExportPlugin();
exportPlugin.install(timeline);

// 导出 PNG
await exportPlugin.exportAs({ format: 'png', quality: 1 });

// 导出 SVG
await exportPlugin.exportAs({ format: 'svg' });
```

## 📄 License

MIT

## 🙏 致谢

参考项目：
- vis-timeline
- timeline.js
- react-calendar-timeline
- vue-timeline
- d3-timeline
