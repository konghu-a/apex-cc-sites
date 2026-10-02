// 开屏动画控制 - 粒子蜂拥成字版
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const particleTextContainer = document.getElementById('particle-text-container');
    const targetText = particleTextContainer ? particleTextContainer.querySelector('.target-text') : null;
    const targetSub = particleTextContainer ? particleTextContainer.querySelector('.target-sub') : null;
    const logoSubDisplay = document.getElementById('logo-sub-display');
    const logoGlow = document.querySelector('.logo-glow');
    const loaderPercent = document.querySelector('.loader-percent');
    const loaderProgress = document.querySelector('.loader-progress');
    const logoScan = document.querySelector('.logo-scan');
    const logoRing = document.querySelector('.logo-ring');

    // ========== 进度条百分比动画 ==========
    let progress = 0;
    const progressInterval = setInterval(function() {
        progress += Math.random() * 12 + 3;
        if (progress > 100) progress = 100;
        if (loaderPercent) {
            loaderPercent.textContent = Math.floor(progress) + '%';
        }
        if (loaderProgress) {
            loaderProgress.style.width = progress + '%';
        }
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 180);

    // ========== 粒子蜂拥成字核心逻辑 ==========
    
    // 使用 Canvas 获取文字像素点作为目标位置
    function getTextParticleTargets(text, fontSize, fontFamily, letterSpacing) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置字体
        ctx.font = `900 ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'top';
        
        // 测量文字宽度（考虑 letter-spacing）
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width + (text.length - 1) * letterSpacing;
        
        // 设置 canvas 尺寸
        canvas.width = Math.ceil(textWidth) + 20;
        canvas.height = fontSize + 20;
        
        // 重新设置字体（canvas 尺寸变化后需要重置）
        ctx.font = `900 ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#fff';
        
        // 逐字绘制以处理 letter-spacing
        let x = 10;
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], x, 10);
            x += ctx.measureText(text[i]).width + letterSpacing;
        }
        
        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // 采样非透明像素点作为目标位置
        const targets = [];
        const scale = Math.max(1, Math.floor(Math.sqrt(pixels.length / 4 / 800))); // 控制粒子数量 ~800
        
        for (let y = 0; y < canvas.height; y += scale) {
            for (let x = 0; x < canvas.width; x += scale) {
                const idx = (y * canvas.width + x) * 4 + 3; // alpha 通道
                if (pixels[idx] > 128) {
                    // 计算相对于中心的位置
                    const relX = (x - canvas.width / 2);
                    const relY = (y - canvas.height / 2);
                    targets.push({ x: relX, y: relY });
                }
            }
        }
        
        return targets;
    }

    // 创建蜂拥粒子
    function createSwarmParticles() {
        if (!particleTextContainer) return;
        
        // 获取容器中心位置
        const containerRect = particleTextContainer.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // 获取主文字 "APEX" 的目标点
        const mainTargets = getTextParticleTargets('APEX', 72, '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto', 30);
        
        // 获取副文字 "官方" 的目标点
        const subTargets = getTextParticleTargets('官方', 24, '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto', 10);
        
        // 合并目标点（副文字位置向下偏移）
        const allTargets = [
            ...mainTargets,
            ...subTargets.map(t => ({ x: t.x, y: t.y + 100 })) // 副文字在主文字下方
        ];
        
        if (allTargets.length === 0) return;
        
        // 为每个目标点创建一个粒子
        allTargets.forEach((target, index) => {
            // 延迟创建，形成蜂拥效果
            const delay = Math.random() * 800 + index * 2; // 错开延迟
            
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'swarm-particle';
                
                // 随机起始位置（屏幕四周）
                const startSide = Math.floor(Math.random() * 4);
                let startX, startY;
                const margin = 100;
                
                switch (startSide) {
                    case 0: // 上
                        startX = Math.random() * window.innerWidth;
                        startY = -margin;
                        break;
                    case 1: // 右
                        startX = window.innerWidth + margin;
                        startY = Math.random() * window.innerHeight;
                        break;
                    case 2: // 下
                        startX = Math.random() * window.innerWidth;
                        startY = window.innerHeight + margin;
                        break;
                    case 3: // 左
                        startX = -margin;
                        startY = Math.random() * window.innerHeight;
                        break;
                }
                
                // 计算相对于容器中心的起始位置
                const relStartX = startX - containerRect.left - centerX;
                const relStartY = startY - containerRect.top - centerY;
                
                // 目标位置
                const endX = target.x;
                const endY = target.y;
                
                // 随机颜色（粉蓝渐变色系）
                const colors = ['#ff69b4', '#dda0dd', '#ffb6c1', '#e6d5f5', '#f0e6ff'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // 随机大小
                const size = 3 + Math.random() * 3;
                
                // 随机旋转
                const rot = (Math.random() - 0.5) * 360;
                
                // 动画时长
                const duration = 0.8 + Math.random() * 0.6;
                
                particle.style.cssText = `
                    left: ${centerX}px;
                    top: ${centerY}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    --start-x: ${relStartX}px;
                    --start-y: ${relStartY}px;
                    --end-x: ${endX}px;
                    --end-y: ${endY}px;
                    --rot: ${rot}deg;
                    animation: swarmFlyIn ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    opacity: 1;
                `;
                
                particleTextContainer.appendChild(particle);
                
                // 动画结束后移除粒子（但最后一批保留形成文字）
                if (index < allTargets.length - 50) {
                    setTimeout(() => {
                        particle.style.transition = 'opacity 0.3s ease';
                        particle.style.opacity = '0';
                        setTimeout(() => particle.remove(), 300);
                    }, duration * 1000);
                }
            }, delay);
        });
        
        // 所有粒子飞入完成后，显示真实文字
        const maxDelay = 800 + allTargets.length * 2;
        setTimeout(() => {
            showFinalText();
        }, maxDelay);
    }
    
    // 显示最终文字
    function showFinalText() {
        if (!targetText || !targetSub) return;
        
        // 移除所有粒子
        const particles = particleTextContainer.querySelectorAll('.swarm-particle');
        particles.forEach(p => p.style.transition = 'opacity 0.5s ease, transform 0.5s ease');
        
        setTimeout(() => {
            particles.forEach(p => p.remove());
            
            // 显示真实文字（添加类触发动画）
            targetText.style.display = 'inline-block';
            targetText.style.animation = 'formText 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            targetText.style.opacity = '0';
            
            targetSub.style.display = 'block';
            targetSub.style.animation = 'formText 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s forwards';
            targetSub.style.opacity = '0';
            
            // logo-glow 发光效果
            if (logoGlow) {
                logoGlow.style.animation = 'logoGlow 1.5s ease-out forwards';
            }
            
            // logo-ring 动画
            if (logoRing) {
                logoRing.style.animation = 'pulse-ring 1s ease-out forwards';
            }
            
            // logo-sub 显示
            if (logoSubDisplay) {
                logoSubDisplay.style.animation = 'fade-in-up 0.8s ease-out 0.2s both, sub-flicker 4s ease-in-out infinite 1s';
            }
            
            // logo-scan 扫描光
            if (logoScan) {
                setTimeout(() => {
                    logoScan.style.animation = 'logo-scan 2s ease-in-out infinite';
                }, 500);
            }
        }, 100);
    }

    // ========== 启动粒子蜂拥动画 ==========
    // 稍微延迟启动，确保布局完成
    setTimeout(() => {
        createSwarmParticles();
    }, 300);

    // ========== 开屏动画结束，显示主内容 ==========
    setTimeout(function() {
        splashScreen.classList.add('fade-out');
        setTimeout(function() {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 600);
    }, 5000); // 稍微延长一点让粒子动画完成
});

// ========== Toast 提示 ==========
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// ========== 购物车功能 ==========
document.querySelectorAll('.add-to-cart').forEach(function(button) {
    button.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        const productName = card.querySelector('h3').textContent;
        
        const originalText = e.target.textContent;
        e.target.textContent = '✓ 已添加';
        e.target.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        showToast(productName + ' 已成功加入购物车！');
        
        setTimeout(function() {
            e.target.textContent = originalText;
            e.target.style.background = '';
        }, 2000);
    });
});

// ========== 导航平滑滚动 ==========
document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ========== QQ 交流群按钮 ==========
document.getElementById('qq-group-btn').addEventListener('click', function(e) {
    e.preventDefault();
    showToast('正在跳转 QQ 交流群...');
    window.location.href = 'https://qm.qq.com/q/FubhvX2X6y';
});

// ========== Toast 样式注入 ==========
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        font-weight: 500;
    }
    
    .toast.show {
        transform: translateX(0);
    }
`;
document.head.appendChild(style);
