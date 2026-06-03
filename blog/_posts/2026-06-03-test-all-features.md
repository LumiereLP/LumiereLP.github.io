---
layout: post
title: "新版博客全功能测试文章"
date: 2026-06-03 19:00:00 +0800
categories: 随笔
math: true                    # 💡 极其重要：开启此项才会自动加载上方的 LaTeX 脚本
---

### 一、 样式框测试（测试多主题适配）

你可以直接在 Markdown 中嵌入我们在 CSS 里写好的自定义样式框：

<div class="custom-box-note">
  <strong>提示：</strong> 这是一个自定义的通知框。在深色模式下它会呈现柔和的半透明蓝色，在羊皮纸模式下会自动融入暖色调！
</div>

<div class="custom-box-warn">
  <strong>警告：</strong> 这是一个警告框。笔画和背景采用了高对比度的黄色系变量。
</div>

### 二、 LaTeX 数学公式测试

KaTeX 渲染速度极快。你可以编写行内公式如 $E=mc^2$，或者块级公式：

$$\int_{a}^{b} x^2 \,dx = \left[ \frac{x^3}{3} \right]_{a}^{b}$$

### 三、 代码框测试

测试 Rouge 语法高亮器是否正常为代码上色：

```javascript
// 测试主题切换核心握手
const theme = localStorage.getItem('blog-theme-preference');
if (theme === 'sepia') {
    document.body.classList.add('theme-sepia');
}
