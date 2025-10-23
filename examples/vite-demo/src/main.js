import { createTimeline, formatDate } from '@ldesign/timeline';

// 示例数据
const initialEvents = [
  {
    id: '1',
    title: '🚀 项目启动',
    description: '项目正式启动，团队组建完成',
    timestamp: new Date('2024-01-15'),
    color: '#1890ff',
  },
  {
    id: '2',
    title: '📋 需求评审',
    description: '完成需求文档评审，确定开发方向',
    timestamp: new Date('2024-02-20'),
    color: '#52c41a',
  },
  {
    id: '3',
    title: '🎨 设计完成',
    description: 'UI/UX 设计全部完成，开始开发',
    timestamp: new Date('2024-03-10'),
    color: '#faad14',
  },
  {
    id: '4',
    title: '💻 开发阶段',
    description: '进入核心功能开发阶段',
    timestamp: new Date('2024-04-01'),
    color: '#722ed1',
  },
  {
    id: '5',
    title: '🧪 测试阶段',
    description: '开始系统测试和bug修复',
    timestamp: new Date('2024-05-15'),
    color: '#eb2f96',
  },
  {
    id: '6',
    title: '🎯 Beta 发布',
    description: 'Beta 版本发布，收集用户反馈',
    timestamp: new Date('2024-06-20'),
    color: '#13c2c2',
  },
  {
    id: '7',
    title: '✨ 正式发布',
    description: 'v1.0.0 正式发布上线',
    timestamp: new Date('2024-07-30'),
    color: '#52c41a',
  },
  {
    id: '8',
    title: '📊 用户反馈',
    description: '收集并处理用户反馈，优化体验',
    timestamp: new Date('2024-08-15'),
    color: '#fa8c16',
  },
  {
    id: '9',
    title: '🔧 v1.1.0',
    description: '功能优化版本发布',
    timestamp: new Date('2024-09-10'),
    color: '#1890ff',
  },
  {
    id: '10',
    title: '🎉 v2.0.0',
    description: '重大版本更新，新增多项功能',
    timestamp: new Date('2024-10-23'),
    color: '#f5222d',
  },
];

// 配置
let currentOrientation = 'horizontal';
let currentRenderType = 'canvas';
let currentEvents = [...initialEvents];
let eventIdCounter = 11;

// 创建时间轴实例
let timeline = createTimeline({
  container: document.getElementById('timeline'),
  events: currentEvents,
  orientation: currentOrientation,
  renderType: currentRenderType,
  width: 1200,
  height: 500,
  zoom: {
    enabled: true,
    min: 0.5,
    max: 5,
    wheel: true,
    pinch: true,
  },
  pan: {
    enabled: true,
    inertia: true,
  },
  animation: {
    enabled: true,
    entrance: true,
    entranceType: 'fade',
    entranceDuration: 600,
  },
  onClick: (event) => {
    console.log('Event clicked:', event);
    alert(`事件: ${event.title}\n时间: ${formatDate(event.timestamp, 'YYYY-MM-DD')}\n描述: ${event.description || '无描述'}`);
  },
  onZoomChange: (zoom) => {
    document.getElementById('zoomLevel').textContent = zoom.toFixed(2) + 'x';
  },
});

// 初始化统计信息
updateStats();
updateEventsList();

// 事件处理
document.getElementById('toggleOrientation').addEventListener('click', () => {
  currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
  recreateTimeline();
  document.getElementById('orientationType').textContent =
    currentOrientation === 'horizontal' ? '水平' : '垂直';
});

document.getElementById('toggleRenderer').addEventListener('click', () => {
  currentRenderType = currentRenderType === 'canvas' ? 'svg' : 'canvas';
  recreateTimeline();
  document.getElementById('rendererType').textContent =
    currentRenderType === 'canvas' ? 'Canvas' : 'SVG';
});

document.getElementById('fit').addEventListener('click', () => {
  timeline.fit();
});

document.getElementById('zoomIn').addEventListener('click', () => {
  timeline.zoomIn();
});

document.getElementById('zoomOut').addEventListener('click', () => {
  timeline.zoomOut();
});

document.getElementById('resetZoom').addEventListener('click', () => {
  timeline.setZoom(1.0);
});

document.getElementById('addEvent').addEventListener('click', () => {
  const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96', '#13c2c2', '#fa8c16'];
  const emojis = ['🎯', '🔥', '⚡', '🌟', '💡', '🎨', '🚀', '🎊', '🎁', '🏆'];
  const titles = ['新功能上线', '版本更新', '里程碑达成', '重要会议', '产品发布', '技术升级', '团队建设', '用户突破'];

  const newEvent = {
    id: `${eventIdCounter++}`,
    title: `${emojis[Math.floor(Math.random() * emojis.length)]} ${titles[Math.floor(Math.random() * titles.length)]}`,
    description: '这是一个随机生成的事件，用于演示添加功能',
    timestamp: randomDate,
    color: colors[Math.floor(Math.random() * colors.length)],
  };

  currentEvents.push(newEvent);
  timeline.addEvent(newEvent);
  updateStats();
  updateEventsList();
});

document.getElementById('removeLastEvent').addEventListener('click', () => {
  if (currentEvents.length > 0) {
    const lastEvent = currentEvents.pop();
    timeline.removeEvent(lastEvent.id);
    updateStats();
    updateEventsList();
  }
});

document.getElementById('clearEvents').addEventListener('click', () => {
  if (confirm('确定要清空所有事件吗？')) {
    currentEvents.forEach(event => timeline.removeEvent(event.id));
    currentEvents = [];
    updateStats();
    updateEventsList();
  }
});

document.getElementById('exportPNG').addEventListener('click', () => {
  const startTime = performance.now();
  timeline.download(`timeline-${Date.now()}.png`, 'png');
  const endTime = performance.now();
  console.log(`PNG 导出耗时: ${(endTime - startTime).toFixed(2)}ms`);
});

document.getElementById('exportSVG').addEventListener('click', () => {
  if (currentRenderType === 'svg') {
    timeline.download(`timeline-${Date.now()}.svg`, 'svg');
  } else {
    alert('请先切换到 SVG 渲染器');
  }
});

document.getElementById('exportJSON').addEventListener('click', () => {
  const data = {
    events: currentEvents,
    config: {
      orientation: currentOrientation,
      renderType: currentRenderType,
    },
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `timeline-data-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

// 样式控制
document.getElementById('nodeSize').addEventListener('input', (e) => {
  const value = e.target.value;
  document.getElementById('nodeSizeValue').textContent = value;
  timeline.update({
    nodeStyle: {
      size: parseInt(value),
    },
  });
});

document.getElementById('lineWidth').addEventListener('input', (e) => {
  const value = e.target.value;
  document.getElementById('lineWidthValue').textContent = value;
  timeline.update({
    lineStyle: {
      width: parseFloat(value),
    },
  });
});

document.getElementById('nodeColor').addEventListener('input', (e) => {
  const value = e.target.value;
  timeline.update({
    nodeStyle: {
      color: value,
    },
  });
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
  if (e.key === '+' || e.key === '=') {
    e.preventDefault();
    timeline.zoomIn();
  } else if (e.key === '-' || e.key === '_') {
    e.preventDefault();
    timeline.zoomOut();
  } else if (e.key === '0') {
    e.preventDefault();
    timeline.setZoom(1.0);
  }
});

// 辅助函数
function recreateTimeline() {
  const startTime = performance.now();

  timeline.destroy();
  timeline = createTimeline({
    container: document.getElementById('timeline'),
    events: currentEvents,
    orientation: currentOrientation,
    renderType: currentRenderType,
    width: 1200,
    height: 500,
    zoom: {
      enabled: true,
      min: 0.5,
      max: 5,
      wheel: true,
      pinch: true,
    },
    pan: {
      enabled: true,
      inertia: true,
    },
    animation: {
      enabled: true,
      entrance: true,
      entranceType: 'fade',
      entranceDuration: 600,
    },
    onClick: (event) => {
      alert(`事件: ${event.title}\n时间: ${formatDate(event.timestamp, 'YYYY-MM-DD')}\n描述: ${event.description || '无描述'}`);
    },
    onZoomChange: (zoom) => {
      document.getElementById('zoomLevel').textContent = zoom.toFixed(2) + 'x';
    },
  });

  const endTime = performance.now();
  updateStats();
  document.getElementById('performance').textContent = `${(endTime - startTime).toFixed(2)}ms`;
}

function updateStats() {
  document.getElementById('eventCount').textContent = currentEvents.length;

  if (currentEvents.length > 0) {
    const timestamps = currentEvents.map(e => new Date(e.timestamp).getTime());
    const minTime = new Date(Math.min(...timestamps));
    const maxTime = new Date(Math.max(...timestamps));
    const range = `${formatDate(minTime, 'YYYY-MM-DD')} ~ ${formatDate(maxTime, 'YYYY-MM-DD')}`;
    document.getElementById('timeRange').textContent = range;
  } else {
    document.getElementById('timeRange').textContent = '-';
  }
}

function updateEventsList() {
  const container = document.getElementById('eventsList');
  container.innerHTML = '';

  if (currentEvents.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">暂无事件</div>';
    return;
  }

  // 按时间排序
  const sortedEvents = [...currentEvents].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  sortedEvents.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="event-card-header">
        <div class="event-card-title">${event.title}</div>
        <div class="event-card-color" style="background: ${event.color}"></div>
      </div>
      <div class="event-card-time">${formatDate(event.timestamp, 'YYYY-MM-DD HH:mm')}</div>
      <div class="event-card-desc">${event.description || '无描述'}</div>
    `;

    card.addEventListener('click', () => {
      timeline.centerOn(event.id);
      timeline.setSelection([event.id]);
    });

    container.appendChild(card);
  });
}

// 性能监控
setInterval(() => {
  const fps = Math.round(1000 / 16.67); // 假设60fps
  document.getElementById('performance').textContent = `~${fps} FPS`;
}, 1000);

console.log('🎉 Timeline Demo 已加载');
console.log('📦 当前事件数:', currentEvents.length);
console.log('🎨 渲染器:', currentRenderType);
console.log('📐 方向:', currentOrientation);

