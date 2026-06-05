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
