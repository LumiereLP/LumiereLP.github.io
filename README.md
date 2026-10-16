# Personal Website

Lumi的个人主页

## Structure

```plaintext
Webpage
├─ .github
│  └─ workflows
├─ assets
│  ├─ css
│  ├─ data
│  ├─ images
│  │  └─ icons
│  └─ js
├─ blog
│  ├─ css
│  └─ js
├─ song
├─ tools
├─ _layouts
└─ _posts
```

## Todo List

### 1. 这里都有些什么（画廊页）

结构：

```plaintext
杂货铺
├── 文具与绘卷（平面设计展示用）
├── 活字印章（字体设计）
│ └── 背景挂画（背景/图片）
├── 光影放映机（Storyboard/VFX/视频展示用）
│ ├── 胶卷盒（视频）
│ ├── 发条皮影（Storyboard）
│ └── 霓虹灯（循环背景视频）
├── 用餐区（o!m谱面）
│ ├── 五谷杂粮（Rice谱面）
│ │ ├── 扬州炒饭（正键型）
│ │ └── 紫米饭团（Technical/Mix）
│ ├── 手作面食（Rice谱面）
│ │ ├── 陕西刀削（Release）
│ │ ├── 苏式清汤（Coordination）
│ │ ├── 咖喱乌冬（Density）
│ │ └── 风味炒面（Technical/Mix）
│ └── 实惠套餐（Hybrid/Tiebreaker）
└── 友情客串（约稿展示区）
```

需要实现的功能：

1. [ ] 禁止复制
2. [ ] 排版设计（可以找找模板）
3. [ ] 平面设计和视频在同一页的不同 `<section>` 里
4. [ ] 使用图池表的脚本解析谱面
5. [ ] 约稿展示区（图片上方覆盖信息）

## 写博客

### 方式一：浏览器里写（推荐）

打开 [Pages CMS](https://app.pagescms.org)，用 GitHub 登录并选择本仓库，进入「博客文章」即可新建/编辑，保存后自动提交并部署。配置见 `.pages.yml`。

### 方式二：直接写 Markdown

复制 `_drafts/_template.md` 到 `_posts/YYYY-MM-DD-英文短名.md`，front matter 最少只需：

```yaml
---
title: "文章标题"
categories: 学术笔记
---
```

`layout: post` 和 `math: true` 已在 `_config.yml` 里默认设置；正文不用再写 `# 标题`。

### 公式写法

统一用 `$$` 包裹，里面**不需要双重转义**：

- 行内：`浓度 $$[\mathrm{H^+}]$$ 增大`
- 独立成行：前后各空一行

  ```markdown
  $$K_w=[\mathrm{H^+}][\mathrm{OH^-}]$$
  ```

不要再用 `\\(...\\)`、`\\[...\\]` 或单个 `$`。

### 本地预览

```bash
bundle install
bundle exec jekyll serve --drafts   # 打开 http://localhost:4000/blog/
```
