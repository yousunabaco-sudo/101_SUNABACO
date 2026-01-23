// サイドバーメニューの制御

// 要素を取得
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const sidebarClose = document.getElementById('sidebarClose');
const accordionHeaders = document.querySelectorAll('.accordion-header');

// メニューを開く
menuToggle.addEventListener('click', () => {
    openSidebar();
});

// メニューを閉じる
sidebarClose.addEventListener('click', () => {
    closeSidebar();
});

// オーバーレイをクリックして閉じる
overlay.addEventListener('click', () => {
    closeSidebar();
});

// ESCキーで閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
    }
});

// メニューを開く関数
function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
    document.body.style.overflow = 'hidden'; // 背景のスクロールを無効化
}

// メニューを閉じる関数
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = ''; // 背景のスクロールを有効化
    
    // 開いているアコーディオンを閉じる（オプション）
    accordionHeaders.forEach(header => {
        const accordionItem = header.parentElement;
        accordionItem.classList.remove('active');
    });
}

// アコーディオンメニューの開閉
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // クリックしたアコーディオンを開閉
        if (isActive) {
            accordionItem.classList.remove('active');
        } else {
            accordionItem.classList.add('active');
        }
    });
});

// アコーディオン内のリンクをクリックしたときの処理（オプション）
const accordionLinks = document.querySelectorAll('.accordion-link');
accordionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // 実際のリンク先がある場合は、ここでメニューを閉じる処理を追加できます
        // e.preventDefault(); // デフォルトの動作を防ぐ場合
        // closeSidebar(); // メニューを閉じる場合
    });
});

