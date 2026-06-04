document.addEventListener('DOMContentLoaded', () => {

    const filterButtons = document.querySelectorAll('.filter-btn');
    const postCards = document.querySelectorAll('.post-card');

    if (filterButtons.length > 0 && postCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. 切换按钮激活状态
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const targetCategory = button.getAttribute('data-target');

                // 2. 过滤文章卡片
                postCards.forEach(card => {
                    if (targetCategory === 'all') {
                        // 显示全部
                        card.classList.remove('is-hidden');
                    } else {
                        // 获取当前卡片包含的所有分类（以空格分隔的数组）
                        const cardCategories = card.getAttribute('data-category').split(' ');
                        
                        if (cardCategories.includes(targetCategory)) {
                            card.classList.remove('is-hidden');
                        } else {
                            card.classList.add('is-hidden');
                        }
                    }
                });
            });
        });
    }

    const fontToggleBtn = document.getElementById('font-toggle');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;

    const savedFont = localStorage.getItem('blog-font-preference');
    if (savedFont === 'serif') {
        body.classList.add('serif-mode');
        if (fontToggleBtn) fontToggleBtn.textContent = '文'; // 切换到衬线体时按钮变成富有墨香感的日/中文字符样式
    }


    if (fontToggleBtn) {
        fontToggleBtn.addEventListener('click', () => {
            body.classList.toggle('serif-mode');
            
            if (body.classList.contains('serif-mode')) {
                localStorage.setItem('blog-font-preference', 'serif');
                fontToggleBtn.textContent = '文';
            } else {
                localStorage.setItem('blog-font-preference', 'sans-serif');
                fontToggleBtn.textContent = 'A';
            }
        });
    }

    function activateTheme(themeName) {

        body.classList.remove('theme-white', 'theme-sepia');
        
        if (themeName === 'white') {
            body.classList.add('theme-white');
        } else if (themeName === 'sepia') {
            body.classList.add('theme-sepia');
        }

        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        localStorage.setItem('blog-theme-preference', themeName);
    }

    const savedTheme = localStorage.getItem('blog-theme-preference') || 'dark';
    activateTheme(savedTheme);

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTheme = button.getAttribute('data-theme');
            activateTheme(selectedTheme);
        });
    });
});