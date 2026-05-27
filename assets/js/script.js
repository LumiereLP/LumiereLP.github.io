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
window.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('heroHeader');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // 让画布尺寸与 header 容器保持一致
    canvas.width = header.clientWidth;
    canvas.height = header.clientHeight;

    let particlesArray = [];
    let mouse = { x: undefined, y: undefined, radius: 150 };

    // 监听 header 的鼠标移动事件（计算相对 header 的坐标）
    header.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    header.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // 粒子类（带物理合力模型）
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = 1.5; // 粒子大小
            this.vx = 0;
            this.vy = 0;
            this.springStrength = 0.1;   // 弹簧强度：数值越大，回弹越硬越快
            this.repulsionStrength = 10;  // 排斥强度：数值越大，鼠标推得越远
            this.friction = 0.55;         // 摩擦力/阻尼：0-1之间，越接近1减速越慢，防止粒子无限震荡
        }

        draw() {
            // 这里用了半透明白色粒子，在你原本的蓝色渐变背景上效果会非常干净、高级
            ctx.fillStyle = 'rgba(135, 183, 255, 0.51)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // 弹簧力
            let dxSpring = this.baseX - this.x;
            let dySpring = this.baseY - this.y;
            let fSpringX = dxSpring * this.springStrength;
            let fSpringY = dySpring * this.springStrength;

            let fRepulsionX = 0;
            let fRepulsionY = 0;

            // 排斥力
            if (mouse.x !== undefined && mouse.y !== undefined) {
                let dxMouse = mouse.x - this.x;
                let dyMouse = mouse.y - this.y;
                let distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distance < mouse.radius) {
                    let t = distance / mouse.radius;
                    let forceFactor = Math.pow(1 - t, 2); // 距离越近力越大
                    let dirX = -dxMouse / (distance || 1);
                    let dirY = -dyMouse / (distance || 1);

                    fRepulsionX = dirX * forceFactor * this.repulsionStrength;
                    fRepulsionY = dirY * forceFactor * this.repulsionStrength;
                }
            }

            // 更新物理状态
            this.vx += fSpringX + fRepulsionX;
            this.vy += fSpringY + fRepulsionY;
            this.vx *= this.friction;
            this.vy *= this.friction;

            this.x += this.vx;
            this.y += this.vy;
        }
    }

    // 加载图片并扫描线稿位置
    const image = new Image();
    image.src = 'assets/images/cover.png'; // 自动读取你原本的图片路径

    image.onload = function() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // 将图片绘制到临时画布中（按 cover 逻辑铺满）
        tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imgData.data;

        particlesArray = [];
        const step = 4; // 采样步长，如果觉得粒子太密/卡顿，可以调大这个值（如 5 或 6）

        for (let y = 0; y < tempCanvas.height; y += step) {
            for (let x = 0; x < tempCanvas.width; x += step) {
                const index = (y * tempCanvas.width + x) * 4;
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];
                const brightness = (r + g + b) / 3;

                // 核心识别：原图 shade 偏暗，线条最暗。
                // 如果你已经换成了“黑底白线图”，请将此处改为 brightness > 128
                if (brightness > 150) { 
                    particlesArray.push(new Particle(x, y));
                }
            }
        }
        animate();
    };

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw();
            particlesArray[i].update();
        }
        requestAnimationFrame(animate);
    }

    // 监听视口大小改变，重新计算
    window.addEventListener('resize', () => {
        canvas.width = header.clientWidth;
        canvas.height = header.clientHeight;
        // 重新加载图片以触发重绘
        image.src = '../images/shade.png?' + new Date().getTime();
    });
});