document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('header');
    var nav = document.querySelector('nav');
    // 分别配置隐藏与恢复阈值：
    var HIDE_THRESHOLD = 50; 
    var SHOW_THRESHOLD = -1; 
    var lastY = window.scrollY || 0;

    function updateScrollState() {
        var currentY = window.scrollY || 0;
        var scrollingDown = currentY > lastY;

        if (scrollingDown && currentY > HIDE_THRESHOLD) {
            header.classList.add('header-hidden');
            nav.classList.remove('nav-visible');
            document.body.classList.add('scrolled');
        } else if (!scrollingDown) {
            // 自动恢复仅在 SHOW_THRESHOLD >= 0 时启用
            if (SHOW_THRESHOLD >= 0 && currentY <= SHOW_THRESHOLD) {
                header.classList.remove('header-hidden');
                nav.classList.remove('nav-visible');
                document.body.classList.remove('scrolled');
            } else if (currentY > HIDE_THRESHOLD) {
                // 向上滚动但还未达到恢复阈值：显示 nav，header 仍隐藏
                nav.classList.add('nav-visible');
                document.body.classList.add('scrolled');
                header.classList.add('header-hidden');
            }
        }

        lastY = currentY;
    }

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    var options = document.querySelectorAll('.dialog-option');
    var typedSpan = document.querySelector('.terminal-line .typed');
    var mainAbout = document.querySelector('main#about');

    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    async function typeToTerminal(text, speed) {
        if (!typedSpan) return;
        typedSpan.textContent = '';
        for (var i = 0; i < text.length; i++) {
            typedSpan.textContent += text.charAt(i);
            await sleep(speed);
        }
    }

    var busy = false;
    options.forEach(function (opt) {
        opt.addEventListener('click', async function (e) {
            e.preventDefault();
            if (busy) return;
            busy = true;

            var text = opt.textContent.trim();
            var targetSelector = opt.dataset.target || opt.getAttribute('href');

            options.forEach(function (o) { o.style.pointerEvents = 'none'; });

            await typeToTerminal(text, 50);

            if (nav) nav.classList.add('nav-collapsed');
            
            if (nav) nav.classList.add('fade-out');

            if (mainAbout) mainAbout.classList.add('slide-up');
            await sleep(1000);

            var panel = document.querySelector(targetSelector + '-panel') || document.querySelector(targetSelector);
            if (panel) {
                panel.classList.add('visible');
                panel.setAttribute('aria-hidden', 'false');
                try { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) {}
            }

            busy = false;
        });
    });

    // 对 nav 中的任意链接，也应用折叠行为（包括 mini-action 链接）
    if (nav) {
        var navLinks = nav.querySelectorAll('a');
        navLinks.forEach(function (lnk) {
            lnk.addEventListener('click', function () {
                nav.classList.add('nav-collapsed');
            });
        });
    }
});
