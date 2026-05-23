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

            await sleep(500);

            if (opt.classList.contains('dialog-back')) {
                restoreNavigation();
                busy = false;
                options.forEach(function (o) { o.style.pointerEvents = ''; });
                return;
            }

            if (nav) nav.classList.add('nav-collapsed');
            
            if (nav) nav.classList.add('fade-out');

            if (mainAbout) mainAbout.classList.add('slide-up');

            setTimeout(() => {
                if (mainAbout) mainAbout.style.display = 'none';
            }, 600);

            var panel = document.querySelector(targetSelector + '-panel') || document.querySelector(targetSelector);
            if (panel) {
                panel.classList.add('visible');
                panel.setAttribute('aria-hidden', 'false');
                setTimeout(() => {
                        var contentTop = document.querySelector('.content').offsetTop;
                        window.scrollTo({
                            top: contentTop + 100,
                            behavior: 'smooth'
                        });
                    }, 50);
            }

            busy = false;
            options.forEach(function (o) { o.style.pointerEvents = ''; });
        });
    });

    function restoreNavigation() {
        var visiblePanel = document.querySelector('.panel.visible');
        if (visiblePanel) {
            visiblePanel.classList.remove('visible');
            visiblePanel.setAttribute('aria-hidden', 'true');
        }
        if (mainAbout) {
            mainAbout.classList.remove('slide-up');
            mainAbout.style.display = '';
        }
        if (nav) {
            nav.classList.remove('nav-collapsed');
            nav.classList.remove('fade-out');
            nav.classList.add('nav-visible');
        }
    }

    
    if (nav) {
        var navLinks = nav.querySelectorAll('a');
        navLinks.forEach(function (lnk) {
            lnk.addEventListener('click', function () {
                nav.classList.add('nav-collapsed');
            });
        });
    }

    var songAction = document.querySelector('a[href="#song"]');
    if (songAction) {
        songAction.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止默认的锚点跳转
            
            fetch('songs.json')
                .then(response => {
                    if (!response.ok) throw new Error('无法读取歌曲数据');
                    return response.json();
                })
                .then(songs => {
                    if (songs && songs.length > 0) {
                        var randomIndex = Math.floor(Math.random() * songs.length);
                        var randomSong = songs[randomIndex];
                        
                        window.location.href = './song/index.html?id=' + randomSong.id;
                    }
                })
                .catch(err => {
                    console.error('加载歌单失败:', err);
                    alert('歌单电波传送失败，请稍后再试');
                });
        });
    }
});
