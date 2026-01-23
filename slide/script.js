// スライドショーの自動切り替え

// 現在表示中のスライドのインデックス
let currentSlide = 0;

// すべてのスライド要素を取得
const slides = document.querySelectorAll('.slide');

// スライドを切り替える関数
function showSlide(index) {
    // インデックスが範囲外の場合は調整
    if (index >= slides.length) {
        currentSlide = 0; // 最初に戻る
    }
    if (index < 0) {
        currentSlide = slides.length - 1; // 最後に移動
    }
    
    // 現在アクティブなスライドを取得
    const currentActiveSlide = document.querySelector('.slide.active');
    
    // 新しいスライドのz-indexを高く設定（上に重ねる）
    slides[currentSlide].style.zIndex = '3';
    
    // 現在アクティブなスライドをフェードアウト
    if (currentActiveSlide) {
        currentActiveSlide.classList.remove('active');
        // フェードアウト完了後、z-indexを元に戻す
        setTimeout(() => {
            currentActiveSlide.style.zIndex = '1';
        }, 1500); // アニメーション時間と同じ
    }
    
    // 新しいスライドをフェードイン
    slides[currentSlide].classList.add('active');
    
    // アニメーション完了後、z-indexを2に設定（次の切り替えのため）
    setTimeout(() => {
        slides[currentSlide].style.zIndex = '2';
    }, 1500);
}

// 次のスライドに進む関数
function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

// 最初のスライドを表示
if (slides.length > 0) {
    slides[currentSlide].style.zIndex = '2';
    slides[currentSlide].classList.add('active');
}

// 3秒ごとに自動で次のスライドに切り替える
setInterval(nextSlide, 5000); // 5000ミリ秒 = 5秒

