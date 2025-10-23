# Timeline Vite Demo

这是一个基于 Vite 的 @ldesign/timeline 完整演示示例。

## 🚀 快速开始

### 安装依赖

```bash
cd libraries/timeline/examples/vite-demo
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看演示。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## ✨ 功能演示

### 1. 布局控制
- ✅ 水平/垂直方向切换
- ✅ Canvas/SVG 渲染器切换
- ✅ 适应视图

### 2. 缩放控制
- ✅ 放大/缩小
- ✅ 鼠标滚轮缩放
- ✅ 触摸捏合缩放
- ✅ 重置缩放
- ✅ 实时显示缩放级别

### 3. 事件管理
- ✅ 添加随机事件
- ✅ 删除事件
- ✅ 清空所有事件
- ✅ 实时事件计数

### 4. 导出功能
- ✅ 导出为 PNG 图片
- ✅ 导出为 SVG 矢量图
- ✅ 导出为 JSON 数据

### 5. 样式控制
- ✅ 节点大小调整
- ✅ 线条宽度调整
- ✅ 节点颜色选择
- ✅ 实时预览

### 6. 交互功能
- ✅ 点击节点查看详情
- ✅ 键盘快捷键（+/-/0）
- ✅ 触摸手势支持
- ✅ 事件列表联动

### 7. 性能监控
- ✅ 渲染器类型显示
- ✅ 时间范围统计
- ✅ 性能指标监控
- ✅ 渲染时间测量

## 📁 项目结构

```
vite-demo/
├── index.html          # HTML 模板
├── package.json        # 依赖配置
├── vite.config.js      # Vite 配置
├── src/
│   ├── main.js         # 主入口文件
│   └── style.css       # 样式文件
└── README.md           # 说明文档
```

## 🎨 技术栈

- **构建工具**: Vite 5.0
- **时间轴库**: @ldesign/timeline
- **语言**: JavaScript (ES Module)
- **样式**: CSS Grid + Flexbox

## 💡 使用示例

### 基础用法

```javascript
import { createTimeline } from '@ldesign/timeline';

const timeline = createTimeline({
  container: document.getElementById('timeline'),
  events: [
    {
      id: '1',
      title: '事件标题',
      timestamp: new Date('2024-01-01'),
      color: '#1890ff',
    },
  ],
  orientation: 'horizontal',
  renderType: 'canvas',
  width: 1200,
  height: 500,
});
```

### 添加事件

```javascript
timeline.addEvent({
  id: '2',
  title: '新事件',
  timestamp: new Date(),
  color: '#52c41a',
});
```

### 缩放控制

```javascript
timeline.zoomIn();   // 放大
timeline.zoomOut();  // 缩小
timeline.setZoom(2); // 设置缩放级别
```

### 导出功能

```javascript
timeline.download('timeline.png', 'png');  // 导出 PNG
timeline.download('timeline.svg', 'svg');  // 导出 SVG
```

## 🔧 配置选项

完整的配置选项请查看 [@ldesign/timeline 文档](../../README.md)。

## 📝 注意事项

1. 开发环境使用 Vite 的模块别名功能直接引用源代码
2. 生产环境需要先构建 @ldesign/timeline 包
3. 支持热模块替换（HMR），修改代码即时生效
4. 推荐使用 Chrome 或 Firefox 最新版本

## 🐛 问题反馈

如果遇到问题，请：
1. 检查浏览器控制台错误信息
2. 确认 @ldesign/timeline 已正确安装
3. 查看 [完整文档](../../README.md)
4. 提交 Issue

## 📄 License

MIT

