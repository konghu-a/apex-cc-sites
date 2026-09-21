// 开屏动画控制
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const loaderPercent = document.querySelector('.loader-percent');
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderText = document.querySelector('.loader-text');

    // 进度条数字动画
    let progress = 0;
    const duration = 3500; // 3.5秒
    const startTime = Date.now();
    
    function animateProgress() {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / duration, 1);
        
        // 使用 ease-out 缓动函数
        const eased = 1 - Math.pow(1 - ratio, 3);
        progress = Math.round(eased * 100);
        
        if (loaderPercent) {
            loaderPercent.textContent = progress + '%';
        }
        
        if (ratio < 1) {
            requestAnimationFrame(animateProgress);
        } else {
            // 动画完成，淡出开屏
            setTimeout(() => {
                splashScreen.classList.add('fade-out');
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                }, 800);
            }, 300);
        }
    }
    
    // 启动进度条动画
    animateProgress();
    
    // 备用：如果动画没跑完，强制结束
    setTimeout(() => {
        if (splashScreen.style.display !== 'none') {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
            }, 800);
        }
    }, 4500);
});

// 添加购物车/付款功能
document.querySelectorAll('.add-to-cart').forEach(function(button) {
    button.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        const productName = card.querySelector('h3').textContent;
        
        // 按钮动画
        const originalText = e.target.textContent;
        e.target.textContent = '✓ 已跳转';
        e.target.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        e.target.style.borderColor = 'transparent';
        
        // 显示提示
        showToast('正在跳转 ' + productName + ' 支付页面...');
        
        // 恢复按钮
        setTimeout(function() {
            e.target.textContent = originalText;
            e.target.style.background = '';
            e.target.style.borderColor = '';
        }, 2000);
    });
});

// Toast 提示
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

// 导航平滑滚动
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

// 添加 toast 样式
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
