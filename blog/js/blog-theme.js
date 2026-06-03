document.addEventListener('DOMContentLoaded', () => {

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