document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('header');
    var nav = document.querySelector('nav');
    var HIDE_THRESHOLD = 50; 
    var SHOW_THRESHOLD = -1; 
    var lastY = window.scrollY || 0;
    var scrollTicking = false;
    function updateScrollState() {
        var currentY = window.scrollY || 0;
        var scrollingDown = currentY > lastY;

        if (scrollingDown && currentY > HIDE_THRESHOLD) {
            header.classList.add('header-hidden');
            nav.classList.remove('nav-visible');
            document.body.classList.add('scrolled');
        } else if (!scrollingDown) {
            if (SHOW_THRESHOLD >= 0 && currentY <= SHOW_THRESHOLD) {
                header.classList.remove('header-hidden');
                nav.classList.remove('nav-visible');
                document.body.classList.remove('scrolled');
            } else if (currentY > HIDE_THRESHOLD) {
                nav.classList.add('nav-visible');
                document.body.classList.add('scrolled');
                header.classList.add('header-hidden');
            }
        }
        lastY = currentY;
        scrollTicking = false;
    }

    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(updateScrollState);
            scrollTicking = true;
        }
    }, { passive: true });

    updateScrollState();

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
                    var contentEl = document.querySelector('.content');
                    var contentTop = contentEl ? contentEl.offsetTop : 0;
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
            e.preventDefault();
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

// --- 粒子特效部分优化 ---
window.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('heroHeader');
    const canvas = document.getElementById('particleCanvas');
    if (!header || !canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = header.clientWidth;
    canvas.height = header.clientHeight;

    let particlesArray = [];
    let mouse = { x: undefined, y: undefined, radius: 300 };
    let isElementVisible = true;
    let animationFrameId = null;

    header.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    header.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = 1.5;
            this.vx = 0;
            this.vy = 0;
            this.springStrength = 0.07;
            this.repulsionStrength = 6;
            this.friction = 0.5;
        }
        draw() {
            ctx.fillStyle = 'rgba(135, 183, 255, 0.51)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dxSpring = this.baseX - this.x;
            let dySpring = this.baseY - this.y;
            let fSpringX = dxSpring * this.springStrength;
            let fSpringY = dySpring * this.springStrength;

            let fRepulsionX = 0;
            let fRepulsionY = 0;

            if (mouse.x !== undefined && mouse.y !== undefined) {
                let dxMouse = mouse.x - this.x;
                let dyMouse = mouse.y - this.y;
                let distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distance < mouse.radius) {
                    let t = distance / mouse.radius;
                    let forceFactor = Math.pow(1 - t, 2);
                    let dirX = -dxMouse / (distance || 1);
                    let dirY = -dyMouse / (distance || 1);

                    fRepulsionX = dirX * forceFactor * this.repulsionStrength;
                    fRepulsionY = dirY * forceFactor * this.repulsionStrength;
                }
            }

            this.vx += fSpringX + fRepulsionX;
            this.vy += fSpringY + fRepulsionY;
            this.vx *= this.friction;
            this.vy *= this.friction;

            this.x += this.vx;
            this.y += this.vy;
        }
    }

    const image = new Image();
    image.src = 'assets/images/cover.png';

    image.onload = function() {
        initParticles();
        startAnimation();
    };

    function initParticles() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imgData.data;

        particlesArray = [];
        const step = 5; // 【优化】步长由 4 提升至 5，粒子数减少 36% 左右，性能大幅飙升且视觉影响极小

        for (let y = 0; y < tempCanvas.height; y += step) {
            for (let x = 0; x < tempCanvas.width; x += step) {
                const index = (y * tempCanvas.width + x) * 4;
                const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
                if (brightness > 150) { 
                    particlesArray.push(new Particle(x, y));
                }
            }
        }
    }

    function animate() {
        if (!isElementVisible) return; // 【优化 1】若移出视口，则停掉绘制
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw();
            particlesArray[i].update();
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationFrameId && isElementVisible) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // 【优化 1】使用 IntersectionObserver 实现离开首屏停止粒子动画
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isElementVisible = entry.isIntersecting;
                if (isElementVisible) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            });
        }, { threshold: 0.05 });
        observer.observe(header);
    }

    // 【优化 1】加入防抖（Debounce）的 Resize 监听，防止频繁重绘卡死
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = header.clientWidth;
            canvas.height = header.clientHeight;
            initParticles();
            if (isElementVisible) startAnimation();
        }, 250); 
    });
});

// --- 联系人与 QQ 卡片逻辑优化 ---
document.addEventListener('DOMContentLoaded', () => {
    const contactRows = document.querySelectorAll('.contact-row');
    const toast = document.getElementById('toast');
    const qqCard = document.getElementById('qq-card');
    const closeBtn = document.querySelector('.card-close-btn');

    let pressTimer = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // 【优化 3】改为按需捕获坐标，不全天候监听全局 mousemove
    function trackMouse(e) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }

    function showToast(text) {
        toast.textContent = text;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function handleCopy(value, label) {
        navigator.clipboard.writeText(value).then(() => {
            showToast(`已成功复制 ${label} 到剪贴板`);
        }).catch(() => {
            showToast('复制失败，请手动输入');
        });
    }

    contactRows.forEach(row => {
        const type = row.getAttribute('data-type');
        const value = row.getAttribute('data-value');
        const url = row.getAttribute('data-url');
        const label = row.querySelector('.btn-trigger span').textContent;

        row.addEventListener('click', (e) => {
            if (type === 'qq') {
                handleCopy(value, 'QQ号');
                return;
            }
            if (type === 'link') {
                window.open(url, '_blank');
            } else if (type === 'copy') {
                handleCopy(value, label);
            }
        });

        if (type === 'qq') {
            const startPress = (e) => {
                if (e.button && e.button !== 0) return;
                
                // 【优化 3】在用户长按动作发生期间，才短暂允许记录坐标
                if (e.clientX) {
                    lastMouseX = e.clientX;
                    lastMouseY = e.clientY;
                    document.addEventListener('mousemove', trackMouse);
                } else if (e.touches && e.touches[0]) {
                    lastMouseX = e.touches[0].clientX;
                    lastMouseY = e.touches[0].clientY;
                }

                pressTimer = setTimeout(() => {
                    showQQCard();
                    document.removeEventListener('mousemove', trackMouse);
                }, 1000);
            };

            const cancelPress = () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
                document.removeEventListener('mousemove', trackMouse);
            };

            row.addEventListener('mousedown', startPress);
            row.addEventListener('mouseup', cancelPress);
            row.addEventListener('mouseleave', cancelPress);

            row.addEventListener('touchstart', startPress, { passive: true });
            row.addEventListener('touchend', cancelPress);
        }
    });

let isDragging = false;
    let startX = 0, startY = 0;   
    let cardX = 0, cardY = 0;     
    let velX = 0, velY = 0;       
    let lastX = 0, lastY = 0;     
    let lastTime = 0;
    let animationFrameId = null;

    function showQQCard() {
        cancelAnimationFrame(animationFrameId);
        
        // 强行斩断之前可能残留的过渡动画
        qqCard.style.transition = 'none';
        qqCard.style.opacity = '1';
        qqCard.style.display = 'flex';
        
        // 动态捕获物理宽高
        const cardWidth = qqCard.offsetWidth || 280;
        const cardHeight = qqCard.offsetHeight || 350; 
        
        // 中心对齐指针
        cardX = lastMouseX - (cardWidth / 2);
        cardY = lastMouseY - (cardHeight / 2);
        
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight;

        // 安全边界，防越界卡死
        if (cardX < 10) cardX = 10;
        if (cardY < 10) cardY = 10;
        if (cardX + cardWidth > viewWidth - 10) cardX = viewWidth - cardWidth - 10;
        if (cardY + cardHeight > viewHeight - 10) cardY = viewHeight - cardHeight - 10;

        qqCard.style.left = `${cardX}px`;
        qqCard.style.top = `${cardY}px`;
        qqCard.style.transformOrigin = 'center center';
        qqCard.style.transform = 'scale(0.8) rotate(0deg)';
        
        // 弹性入场
        requestAnimationFrame(() => {
            qqCard.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s';
            qqCard.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // 动画结束后解除 transition 束缚
        setTimeout(() => {
            if(!isDragging) qqCard.style.transition = 'none';
        }, 250);
    }

    function closeQQCard() {
        qqCard.style.transition = 'opacity 0.2s, transform 0.2s';
        qqCard.style.opacity = '0';
        qqCard.style.transform = 'scale(0.8)';
        setTimeout(() => {
            qqCard.style.display = 'none';
        }, 200);
    }

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeQQCard();
    });

    qqCard.addEventListener('click', (e) => {
        if (!isDragging && Math.abs(velX) < 1 && Math.abs(velY) < 1) {
            closeQQCard();
        }
    });

    const onStart = (e) => {
        if (e.target.classList.contains('card-close-btn')) return;
        isDragging = true;
        
        cancelAnimationFrame(animationFrameId);
        qqCard.style.transition = 'none';

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        startX = clientX - cardX;
        startY = clientY - cardY;
        
        lastX = cardX;
        lastY = cardY;
        lastTime = performance.now();
        velX = 0;
        velY = 0;
    };

    const onMove = (e) => {
        if (!isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (!clientX || !clientY) return;

        cardX = clientX - startX;
        cardY = clientY - startY;

        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        
        velX = (cardX - lastX) / dt;
        velY = (cardY - lastY) / dt;

        lastX = cardX;
        lastY = cardY;
        lastTime = now;

        const rotateDeg = Math.min(Math.max(velX * 15, -15), 15); 
        qqCard.style.left = `${cardX}px`;
        qqCard.style.top = `${cardY}px`;
        qqCard.style.transform = `rotate(${rotateDeg}deg)`;
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        
        let throwVx = isNaN(velX) ? 0 : velX * 16;
        let throwVy = isNaN(velY) ? 0 : velY * 16;
        
        startGravityFall(throwVx, throwVy);
    };

    function startGravityFall(initialVx, initialVy) {
        cancelAnimationFrame(animationFrameId);
        
        qqCard.style.transition = 'none';

        let currentX = parseFloat(qqCard.style.left);
        if (isNaN(currentX)) currentX = cardX || 0;
        
        let currentY = parseFloat(qqCard.style.top);
        if (isNaN(currentY)) currentY = cardY || 0;
        
        let vx = initialVx || 0;          
        let vy = initialVy || 1;          
        
        const gravity = 0.4;         
        const airResistance = 0.98;  
        
        let opacity = 1;
        let rotation = 0;
        let rotationSpeed = (vx * 0.2) + (Math.random() - 0.5) * 2; 

        const cardWidth = qqCard.offsetWidth || 280;
        const cardHeight = qqCard.offsetHeight || 350; 
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight; 

        function updatePhysics() {
            vy += gravity;           
            vx *= airResistance;     
            
            currentX += vx;          
            currentY += vy;
            rotation += rotationSpeed; 

            if (currentY > viewHeight - (cardHeight * 0.2)) {
                opacity -= 0.04; 
            }

            qqCard.style.left = `${currentX}px`;
            qqCard.style.top = `${currentY}px`;
            qqCard.style.opacity = Math.max(opacity, 0);
            qqCard.style.transform = `rotate(${rotation}deg)`;

            if (currentY < viewHeight + 300 && opacity > 0) {
                animationFrameId = requestAnimationFrame(updatePhysics);
            } else {
                qqCard.style.display = 'none';
                qqCard.style.opacity = '1'; 
                qqCard.style.transform = 'none';
                cancelAnimationFrame(animationFrameId);
            }
        }

        animationFrameId = requestAnimationFrame(updatePhysics);
    }

    qqCard.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    qqCard.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
});