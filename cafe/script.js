// スライドショー機能
function initSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const slideInterval = 5000; // 5秒ごとにスライド

    function showSlide(index) {
        // すべてのスライドとインジケーターからactiveクラスを削除
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 現在のスライドとインジケーターにactiveクラスを追加
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // インジケータークリック時の処理
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            // 自動スライドをリセット
            clearInterval(slideIntervalId);
            slideIntervalId = setInterval(nextSlide, slideInterval);
        });
    });

    // 自動スライド開始
    let slideIntervalId = setInterval(nextSlide, slideInterval);

    // 初期表示
    showSlide(0);
}

// スムーズスクロールとナビゲーションのハイライト
document.addEventListener('DOMContentLoaded', function() {
    // スライドショーを初期化
    initSlideshow();
    // ナビゲーションリンクのスムーズスクロール
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // スクロール時のナビゲーションバーのスタイル変更
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.backgroundColor = 'rgba(44, 44, 44, 0.98)';
            navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.backgroundColor = 'rgba(44, 44, 44, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        }
        
        lastScroll = currentScroll;
    });

    // メニューアイテムのアニメーション（スクロール時に表示）
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // メニューアイテムと情報カードにアニメーションを適用
    const menuItems = document.querySelectorAll('.menu-item');
    const infoCards = document.querySelectorAll('.info-card');

    [...menuItems, ...infoCards].forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

