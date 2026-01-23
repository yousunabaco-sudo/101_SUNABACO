// スライドショーの自動切り替え

// 現在表示中のスライドのインデックス
let currentSlide = 0;

// すべてのスライド要素を取得
const slides = document.querySelectorAll('.slide');

// スライドを切り替える関数
function showSlide(index) {
    // すべてのスライドを非表示にする
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // インデックスが範囲外の場合は調整
    if (index >= slides.length) {
        currentSlide = 0; // 最初に戻る
    }
    if (index < 0) {
        currentSlide = slides.length - 1; // 最後に移動
    }
    
    // 現在のスライドを表示
    slides[currentSlide].classList.add('active');
}

// 次のスライドに進む関数
function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

// 最初のスライドを表示
showSlide(currentSlide);

// 3秒ごとに自動で次のスライドに切り替える
setInterval(nextSlide, 3000); // 3000ミリ秒 = 3秒

