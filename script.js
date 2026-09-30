// 开屏动画控制 - 碎裂重组版
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const logoText = document.querySelector('.logo-text');
    const logoSub = document.querySelector('.logo-sub');
    const logoGlow = document.querySelector('.logo-glow');
    const loaderPercent = document.querySelector('.loader-percent');
    const loaderProgress = document.querySelector('.loader-progress');
    const logoScan = document.querySelector('.logo-scan');
    const burstContainer = document.querySelector('.burst-container');
    const rings = document.querySelectorAll('.splash-ring');
    const particles = document.querySelectorAll('.particle');
    const scanLine = document.querySelector('.scan-line');

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

    // ========== 工具函数：创建爆炸粒子 ==========
    function createBurstParticles(count) {
        if (!burstContainer) return;
        burstContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'burst-particle';
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
            const distance = 120 + Math.random() * 180;
            const bx = Math.cos(angle) * distance;
            const by = Math.sin(angle) * distance;
            const size = 4 + Math.random() * 6;
            const delay = Math.random() * 0.15;
            const duration = 0.7 + Math.random() * 0.5;
            p.style.cssText = `
                width: ${size}px; height: ${size}px;
                --bx: ${bx}px; --by: ${by}px;
                animation: particleBurst ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards;
            `;
            burstContainer.appendChild(p);
        }
    }

    // ========== 工具函数：创建背景碎片 ==========
    function createBgShards(count) {
        const shardContainer = document.createElement('div');
        shardContainer.className = 'shard-container';
        splashScreen.insertBefore(shardContainer, splashScreen.firstChild);
        
        for (let i = 0; i < count; i++) {
            const s = document.createElement('div');
            s.className = 'bg-shard';
            const angle = Math.random() * Math.PI * 2;
            const dist = 80 + Math.random() * 220;
            const sx = Math.cos(angle) * dist;
            const sy = Math.sin(angle) * dist - 100;
            const size = 6 + Math.random() * 10;
            const delay = Math.random() * 0.6;
            const duration = 1.2 + Math.random() * 1.0;
            const opacity = 0.4 + Math.random() * 0.4;
            const hue = Math.random() > 0.5 ? 26 : 50;
            s.style.cssText = `
                width: ${size}px; height: ${size}px;
                --sx: ${sx}px; --sy: ${sy}px;
                background: hsla(${hue}, 90%, 55%, ${opacity});
                clip-path: polygon(${50 + Math.random()*10}% 0%, 100% ${50 + Math.random()*10}%, ${50 - Math.random()*10}% 100%, 0% ${50 - Math.random()*10}%);
                animation: bgShardFloat ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards;
            `;
            shardContainer.appendChild(s);
        }
        
        // 清理容器
        setTimeout(() => shardContainer.remove(), 4000);
    }

    // ========== 碎裂重组动画时间线 ==========
    
    // Phase 1: 初始状态 - 字母隐藏 (CSS .shattered 类已处理)
    
    // Phase 2: 碎片飞出动画 (延迟 100ms 开始，每个字母错开)
    const letters = document.querySelectorAll('.logo-text .letter');
    const letterTexts = ['A', 'P', 'E', 'X'];
    
    letters.forEach((letter, idx) => {
        // 设置字母文字内容
        letter.textContent = letterTexts[idx];
        
        // 生成随机飞出参数
        const angle = (Math.PI * 2 * idx) / letters.length + (Math.random() - 0.5) * 0.5;
        const distance = 180 + Math.random() * 120;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rot = (Math.random() - 0.5) * 720; // -360 到 360 度
        
        letter.style.setProperty('--tx', `${tx}px`);
        letter.style.setProperty('--ty', `${ty}px`);
        letter.style.setProperty('--rot', `${rot}deg`);
        
        // 启动飞出动画
        setTimeout(() => {
            letter.style.animation = `shardFlyOut 0.8s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards`;
            letter.style.opacity = '1';
        }, 100 + idx * 60);
    });
    
    // Phase 3: 碎片重组飞回 (延迟 1200ms 开始)
    setTimeout(() => {
        logoText.classList.remove('shattered');
        logoText.classList.add('reforming');
        
        letters.forEach((letter, idx) => {
            // 重用相同的飞出参数，反向动画
            const tx = letter.style.getPropertyValue('--tx');
            const ty = letter.style.getPropertyValue('--ty');
            const rot = letter.style.getPropertyValue('--rot');
            
            letter.style.setProperty('--tx', tx);
            letter.style.setProperty('--ty', ty);
            letter.style.setProperty('--rot', rot);
            
            setTimeout(() => {
                letter.style.animation = `shardReform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                letter.style.opacity = '1';
            }, idx * 50);
        });
        
        // Phase 4: 发光闪烁 + 粒子爆炸 (重组完成后 300ms)
        setTimeout(() => {
            logoText.classList.remove('reforming');
            logoText.classList.add('reformed', 'glow-flash');
            logoGlow.style.animation = 'logoGlow 1.5s ease-out forwards';
            createBurstParticles(36);
            createBgShards(28);
        }, 500);
        
        // Phase 5: 副标题淡入
        setTimeout(() => {
            logoSub.style.animation = 'fade-in-up 0.8s ease-out 0.2s both, sub-flicker 4s ease-in-out infinite 1s';
        }, 600);
        
        // Phase 6: 扫描光效果
        setTimeout(() => {
            logoScan.style.animation = 'logo-scan 2s ease-in-out infinite';
        }, 800);
        
    }, 1200);

    // ========== 开屏动画结束，显示主内容 ==========
    setTimeout(function() {
        splashScreen.classList.add('fade-out');
        setTimeout(function() {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 600);
    }, 4200);
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
