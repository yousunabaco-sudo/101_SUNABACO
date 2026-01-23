// ヘッダーのスクロール追従効果
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTop');

// スクロールイベント
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // ページトップに戻るボタンの表示/非表示
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// スムーズスクロール（後で定義される変数を使用するため、関数として定義）
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューが開いている場合は閉じる
                if (nav && nav.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
    });
}

// ===== ハンバーガーメニュー =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');

// メニューを閉じる関数
function closeMenu() {
    if (nav) {
        nav.classList.remove('active');
    }
    if (hamburger) {
        hamburger.classList.remove('active');
    }
    if (navOverlay) {
        navOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// スムーズスクロールを初期化
initSmoothScroll();

// ハンバーガーメニューの開閉
if (hamburger && nav && navOverlay) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // メニューが開いているときは背景のスクロールを無効化
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // オーバーレイをクリックしたときに閉じる
    navOverlay.addEventListener('click', closeMenu);
}

// メニューリンクをクリックしたときに閉じる（スムーズスクロールの処理内で既に実装済み）

// ===== ヒーロースライドショー =====
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

// スライドを切り替える関数
function showSlide(index) {
    // 全てのスライドからactiveクラスを削除
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 現在のスライドを設定
    currentSlide = index;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    // アクティブなスライドを表示
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// 次のスライドに進む
function nextSlide() {
    showSlide(currentSlide + 1);
}

// インジケーターをクリックしたとき
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
    });
});

// 5秒ごとに自動で次のスライドに切り替える
setInterval(nextSlide, 5000);

// 最初のスライドを表示
showSlide(0);

// ===== お問い合わせフォームバリデーション =====
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// バリデーション関数
function validateName() {
    const name = nameInput.value.trim();
    if (name === '') {
        nameError.textContent = 'お名前を入力してください';
        nameInput.classList.add('error');
        nameInput.classList.remove('success');
        return false;
    } else if (name.length < 2) {
        nameError.textContent = 'お名前は2文字以上で入力してください';
        nameInput.classList.add('error');
        nameInput.classList.remove('success');
        return false;
    } else {
        nameError.textContent = '';
        nameInput.classList.remove('error');
        nameInput.classList.add('success');
        return true;
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        emailError.textContent = 'メールアドレスを入力してください';
        emailInput.classList.add('error');
        emailInput.classList.remove('success');
        return false;
    } else if (!emailPattern.test(email)) {
        emailError.textContent = '正しいメールアドレスを入力してください';
        emailInput.classList.add('error');
        emailInput.classList.remove('success');
        return false;
    } else {
        emailError.textContent = '';
        emailInput.classList.remove('error');
        emailInput.classList.add('success');
        return true;
    }
}

function validateMessage() {
    const message = messageInput.value.trim();
    if (message === '') {
        messageError.textContent = 'お問い合わせ内容を入力してください';
        messageInput.classList.add('error');
        messageInput.classList.remove('success');
        return false;
    } else if (message.length < 10) {
        messageError.textContent = 'お問い合わせ内容は10文字以上で入力してください';
        messageInput.classList.add('error');
        messageInput.classList.remove('success');
        return false;
    } else {
        messageError.textContent = '';
        messageInput.classList.remove('error');
        messageInput.classList.add('success');
        return true;
    }
}

// リアルタイムバリデーション
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
messageInput.addEventListener('blur', validateMessage);

// フォーム送信時のバリデーション
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();
    
    if (isNameValid && isEmailValid && isMessageValid) {
        // バリデーション成功時の処理
        alert('お問い合わせありがとうございます。\n\n送信が完了しました。\n（これはサンプルなので実際には送信されません）');
        
        // フォームをリセット
        contactForm.reset();
        nameInput.classList.remove('success', 'error');
        emailInput.classList.remove('success', 'error');
        messageInput.classList.remove('success', 'error');
    } else {
        // エラーがある場合は最初のエラー項目にフォーカス
        if (!isNameValid) {
            nameInput.focus();
        } else if (!isEmailValid) {
            emailInput.focus();
        } else if (!isMessageValid) {
            messageInput.focus();
        }
    }
});

// ===== ページトップに戻るボタン =====
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

