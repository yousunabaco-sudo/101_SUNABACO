// ヒーロースライダー機能
function initHeroSlider() {
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

// スムーズスクロール機能
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// スクロールアニメーション機能
function initScrollAnimation() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 一度表示されたら監視を停止（パフォーマンス向上）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // すべてのfade-in要素を監視
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// ページ読み込み時にスライダーとスムーズスクロール、スクロールアニメーションを初期化
document.addEventListener('DOMContentLoaded', function() {
  initHeroSlider();
  initSmoothScroll();
  initScrollAnimation();
});

