# Personal Website

Lumi的个人主页

## Structure

- `index.html` - 主页
- `assets/css/style.css` - 样式
- `assets/js/script.js` - JavaScript

## Todo List

### 1. 这里都有些什么（画廊页）

结构：

- 杂货铺
- ├── 文具与绘卷（平面设计展示用）
- │ ├── 活字印章（字体设计）
- │ └── 背景挂画（背景/图片）
- ├── 光影放映机（Storyboard/VFX/视频展示用）
- │ ├── 胶卷盒（视频）
- │ ├── 发条皮影（Storyboard）
- │ └── 霓虹灯（循环背景视频）
- ├── 用餐区（o!m谱面）
- │ ├── 五谷杂粮（Rice谱面）
- │ │ ├── 扬州炒饭（正键型）
- │ │ └── 紫米饭团（Technical/Mix）
- │ ├── 手作面食（Rice谱面）
- │ │ ├── 陕西刀削（Release）
- │ │ ├── 苏式清汤（Coordination）
- │ │ ├── 咖喱乌冬（Density）
- │ │ └── 风味炒面（Technical/Mix）
- │ └── 实惠套餐（Hybrid/Tiebreaker）
- └── 友情客串（约稿展示区）

### 2. 博客文章

#### 第一阶段：准备工作与目录规范

* [x] 在博客的根目录下确认或创建 `_layouts/` 文件夹
* [x] 创建专属于博客文章的模板文件 `_layouts/post.html`
* [x] 创建博客专属样式与脚本存放路径：
* [x] `blog/css/blog.css`
* [x] `blog/js/blog-theme.js`


* [x] 创建文章存放文件夹 `_posts/`

#### 第二阶段：样式与主题开发 (`blog/css/blog.css`)

* [x] **字体变量与样式定义（来自Google fonts）**
* [x] 定义默认非衬线体组合（`--font-body`：优先使用Lora，中文fallback到Noto Serif CJK SC（可变字体））
* [x] 定义 `.serif-mode` 类下的衬线体组合：优先使用Figtree，中文fallback到Noto Sans CJK SC（均为可变字体）

* [x] **色彩主题变量定义**
* [x] 定义默认深色主题（`:root`）：深底（#121212）白字 + 降低饱和度的样式框颜色
  - 背景：#121212
  - 文本：#FFFFFF
  - 色彩：#66d6ff（主要/强调色） #b1eaff次要
* [x] 定义纯白主题（`.theme-white`）：白底黑字 + 高明度样式框颜色
  - 背景：#ededed
  - 文本：#121212
  - 色彩：#66d6ff（主要/强调色） #b1eaff次要
 
* [x] 定义浅黄主题（`.theme-sepia`）：杏黄底（）深褐字 + 暖调样式框颜色
  - 背景：#f5eede
  - 文本：#362a1b
  - 色彩：#66d6ff（主要/强调色） #b1eaff次要


* [x] **自定义样式框（Component）**
* [x] 编写通用提示框 `.custom-box-note`，使用 CSS 变量绑定背景、边框和文字颜色


#### 第三阶段：交互逻辑与持久化 (`blog/js/blog-theme.js`)

* [x] **初始化检查**
* [x] 从 `localStorage` 读取用户的字体偏好，若为 `serif` 则为 `<body>` 添加 `.serif-mode`
* [x] 从 `localStorage` 读取用户的主题偏好，激活对应的 `.theme-white` 或 `.theme-sepia`

* [x] **事件监听器**
* [x] 编写字体切换按钮的点击事件，实现 Class 切换并更新 `localStorage`
* [x] 编写主题切换控件（按钮或下拉菜单）的点击事件，实现三状态切换并更新 `localStorage`

#### 第三.五阶段：博客导航页完善 (`blog/index.html`)

* [x] **页面结构与导航**
* [x] 创建响应式博客首页，包含精美的页头和导航栏
* [x] 添加返回主页链接
* [x] 集成字体和主题切换控件

* [x] **文章列表展示**
* [x] 创建文章卡片组件（支持标题、日期、分类、摘要、标签）
* [x] 实现空状态提示
* [x] 添加悬停交互效果

* [x] **文章加载与搜索** (`blog/js/blog-loader.js`)
* [x] 实现文章加载函数，支持从 `_posts` 动态加载
* [x] 添加搜索功能（按标题、摘要、标签）
* [x] 添加分类和标签筛选功能
* [x] 日期格式化和排序

* [x] **样式与响应式设计**
* [x] 完整的响应式设计，支持移动端
* [x] 集成三套主题色彩系统
* [x] 优化控制按钮和选择器的 UX

#### 第四阶段：Jekyll 模板集成 (`_layouts/post.html`)

* [x] 在 `<head>` 中引入全局样式 `main.css` 和博客专属样式 `blog/css/blog.css`
* [x] 在 `<body>` 顶部或侧边栏加入控制组件（字体切换按钮、主题切换按钮）
* [x] 留出文章正文占位符 `{{ content }}`
* [x] 在页面底部引入 `blog/js/blog-theme.js`

**增强特性：**
* [x] 文章头部元数据（标题、日期、分类、作者、阅读时间）
* [x] 优雅的导航栏（返回博客、返回主页）
* [x] 响应式两栏布局（主内容 + 侧边栏）
* [x] 文章标签和分类
* [x] 关联文章推荐
* [x] KaTeX LaTeX 公式支持（CDN）
* [x] Highlight.js 代码高亮支持（CDN）
* [x] 移动端优化

##### 第五阶段：扩展功能配置 (`_config.yml`)

* [x] **Markdown 渲染增强**
* [x] 配置 `kramdown` 插件，确保支持代码块高亮（GFM 模式，语法高亮器使用 Rouge）

* [x] **LaTeX 公式支持**
* [x] **轻量方案**：在 `post.html` 中引入 KaTeX 的 CDN 脚本

**配置文件特性：**
* [x] 完整的 Jekyll 配置（标题、描述、作者等）
* [x] Kramdown 配置（GFM、代码块行号、目录）
* [x] Rouge 代码高亮器配置
* [x] Jekyll 插件配置（feed、SEO、sitemap）
* [x] 文章默认设置（布局、作者、目录）
* [x] 时区和本地化设置

#### 第六阶段：内容测试与发布

* [x] 在 `_posts/` 下创建一篇测试文章 `2026-06-03-test-features.md`
* [x] 在测试文章中写入：
* [x] 标准 Markdown 文本（测试衬线/非衬线切换）
* [x] 自定义 HTML 样式框（测试三套主题下的色彩适配）
* [x] 代码块 - JavaScript、Python、HTML（测试高亮和代码框样式）
* [x] LaTeX 公式（测试 KaTeX 公式渲染）

**测试文章特性：**
* [x] 完整的前置数据（YAML Front Matter）
* [x] 多级标题和段落
* [x] 所有类型的列表（有序、无序、嵌套）
* [x] 表格组件
* [x] 4 种自定义样式框（笔记、警告、成功、信息）
* [x] 代码高亮示例（多语言）
* [x] 行内公式和块级公式
* [x] 功能验证清单

#### 第七阶段：部署准备

* [x] 创建 `Gemfile` - 管理 Jekyll 和依赖包
* [x] 创建 `.gitignore` - 排除不必要的文件

**生成文件：**
* [x] `Gemfile` - Ruby gem 依赖配置
  - jekyll ~> 4.3.0
  - jekyll-feed、jekyll-seo-tag、jekyll-sitemap
  - kramdown 和 rouge 用于 Markdown 和代码高亮
* [x] `.gitignore` - Git 忽略配置
  - Jekyll 生成文件（_site/、.jekyll-cache/）
  - Ruby 文件（gems、vendor/）
  - IDE 和 OS 文件
