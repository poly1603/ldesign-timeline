# ⚡ 快速开始

## 安装

```bash
npm install @ldesign/timeline
```

## 5 分钟上手

### 1. 原生 JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Timeline Demo</title>
</head>
<body>
  <div id="timeline"></div>
  
  <script type="module">
    import { createTimeline } from '@ldesign/timeline';
    
    const timeline = createTimeline({
      container: document.getElementById('timeline'),
      events: [
        {
          id: '1',
          title: '项目启动',
          timestamp: new Date('2024-01-01'),
          color: '#1890ff',
        },
        {
          id: '2',
          title: '第一个版本',
          timestamp: new Date('2024-06-01'),
          color: '#52c41a',
        },
      ],
      width: 800,
      height: 600,
    });
    
    // 添加事件
    timeline.addEvent({
      id: '3',
      title: '新功能',
      timestamp: new Date('2024-09-01'),
    });
    
    // 缩放
    timeline.zoomIn();
    
    // 导出
    timeline.download('timeline.png');
  </script>
</body>
</html>
```

### 2. Vue 3

#### 使用组件

```vue
<template>
  <Timeline
    :events="events"
    :width="800"
    :height="600"
    orientation="horizontal"
    @ready="onReady"
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
    title: '第一个版本',
    timestamp: new Date('2024-06-01'),
  },
]);

const onReady = (instance) => {
  console.log('Timeline ready!', instance);
};
</script>
```

#### 使用 Composable

```vue
<template>
  <div ref="container"></div>
  <button @click="zoomIn">放大</button>
  <button @click="zoomOut">缩小</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTimeline } from '@ldesign/timeline/vue';

const config = ref({
  events: [
    { id: '1', title: '事件1', timestamp: new Date() },
    { id: '2', title: '事件2', timestamp: new Date() },
  ],
  width: 800,
  height: 600,
});

const { container, zoomIn, zoomOut, download } = useTimeline(config);
</script>
```

### 3. React

#### 使用组件

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
      title: '第一个版本',
      timestamp: new Date('2024-06-01'),
    },
  ];

  return (
    <Timeline
      events={events}
      width={800}
      height={600}
      orientation="horizontal"
      onReady={(instance) => {
        console.log('Timeline ready!', instance);
      }}
    />
  );
}

export default App;
```

#### 使用 Hook

```tsx
import React from 'react';
import { useTimeline } from '@ldesign/timeline/react';

function App() {
  const { containerRef, zoomIn, zoomOut, download } = useTimeline({
    events: [
      { id: '1', title: '事件1', timestamp: new Date() },
      { id: '2', title: '事件2', timestamp: new Date() },
    ],
    width: 800,
    height: 600,
  });

  return (
    <div>
      <div ref={containerRef}></div>
      <button onClick={zoomIn}>放大</button>
      <button onClick={zoomOut}>缩小</button>
    </div>
  );
}
```

## 常用配置

### 基础配置

```typescript
{
  events: [],              // 事件列表
  orientation: 'horizontal', // 方向：horizontal | vertical
  renderType: 'canvas',    // 渲染类型：canvas | svg
  width: 800,              // 宽度
  height: 600,             // 高度
}
```

### 样式配置

```typescript
{
  background: '#ffffff',   // 背景色
  nodeStyle: {
    size: 12,             // 节点大小
    color: '#1890ff',     // 节点颜色
    borderWidth: 2,       // 边框宽度
  },
  lineStyle: {
    width: 2,             // 线条宽度
    color: '#d9d9d9',     // 线条颜色
  },
}
```

### 交互配置

```typescript
{
  zoom: {
    enabled: true,        // 启用缩放
    min: 0.1,            // 最小缩放
    max: 10,             // 最大缩放
    wheel: true,         // 鼠标滚轮缩放
  },
  pan: {
    enabled: true,        // 启用平移
    inertia: true,       // 惯性滚动
  },
}
```

### 动画配置

```typescript
{
  animation: {
    enabled: true,        // 启用动画
    entrance: true,       // 入场动画
    entranceType: 'fade', // 动画类型：fade | slide | zoom
    entranceDuration: 600, // 动画时长
  },
}
```

## 常用方法

```typescript
// 事件操作
timeline.addEvent(event);           // 添加事件
timeline.removeEvent(eventId);      // 移除事件
timeline.updateEvent(id, updates);  // 更新事件
timeline.getEvent(eventId);         // 获取事件

// 视图控制
timeline.zoomIn();                  // 放大
timeline.zoomOut();                 // 缩小
timeline.setZoom(2.0);             // 设置缩放级别
timeline.panTo(x, y);              // 平移到指定位置
timeline.centerOn(eventId);        // 居中到事件
timeline.fit();                    // 适应视图

// 选择操作
timeline.setSelection(['id1', 'id2']); // 设置选中
timeline.getSelection();           // 获取选中
timeline.clearSelection();         // 清除选中

// 导出操作
timeline.toDataURL('png', 1.0);    // 导出 Data URL
timeline.toSVGString();            // 导出 SVG 字符串
timeline.download('timeline.png'); // 下载图片
```

## 插件使用

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

### 实时数据插件

```typescript
import { RealtimePlugin } from '@ldesign/timeline';

const realtimePlugin = new RealtimePlugin({
  enabled: true,
  url: 'ws://localhost:3000',
});

realtimePlugin.install(timeline);
```

### 3D 插件

```typescript
import { ThreePlugin } from '@ldesign/timeline';

const threePlugin = new ThreePlugin({
  enabled: true,
  cameraPosition: { x: 0, y: 0, z: 500 },
  controls: true,
});

threePlugin.install(timeline);
```

## 完整示例

查看 `examples/basic.html` 获取完整的工作示例。

## 下一步

- 查看 [完整文档](./README.md)
- 探索 [示例代码](./examples/)
- 了解 [API 参考](./README.md#api)
- 阅读 [实现总结](./IMPLEMENTATION_SUMMARY.md)

## 需要帮助？

- 查看 [GitHub Issues](https://github.com/ldesign/timeline/issues)
- 阅读 [FAQ](./README.md#faq)
- 联系技术支持

---

祝你使用愉快！🎉

