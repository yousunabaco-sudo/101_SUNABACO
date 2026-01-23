# サイドバーメニューサンプル

左側からスライドインするサイドバーメニューと、アコーディオンプルダウンメニューのサンプルです。

## 機能

### 1. サイドバーメニュー
- 左上のメニューボタンをクリックすると、左側からメニューがスライドインします
- 背景をクリックするか、×ボタンで閉じることができます
- ESCキーでも閉じることができます

### 2. アコーディオンメニュー
- メニュー内の項目をクリックすると、サブメニューが開閉します
- 複数のアコーディオンを同時に開くことができます
- アイコンが回転して開閉状態を示します

### 3. レスポンシブ対応
- スマートフォンでは全画面表示になります
- タブレットやPCでは適切な幅で表示されます

## 使い方

1. `index.html` をブラウザで開くだけです
2. 左上のメニューボタンをクリックしてメニューを開きます
3. メニュー内の項目をクリックしてアコーディオンを開閉します

## カスタマイズ方法

### メニュー項目を追加
`index.html` の `.sidebar-nav` 内に新しいアコーディオン項目を追加：

```html
<div class="accordion-item">
    <div class="accordion-header">
        <i class="fas fa-icon-name"></i>
        <span>メニュー名</span>
        <i class="fas fa-chevron-down accordion-icon"></i>
    </div>
    <div class="accordion-content">
        <a href="#" class="accordion-link">
            <i class="fas fa-sub-icon"></i>
            <span>サブメニュー</span>
        </a>
    </div>
</div>
```

### アイコンを変更
Font Awesomeのアイコンクラスを変更してください。利用可能なアイコンは [Font Awesome](https://fontawesome.com/icons) で確認できます。

例：
- `fa-home` → `fa-user`
- `fa-shopping-cart` → `fa-store`

### 色を変更
`style.css` の以下の部分を編集：

```css
/* メインカラー */
#667eea → 好きな色コード

/* グラデーション */
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### メニューの幅を変更
`style.css` の `.sidebar` の `width` を変更：

```css
.sidebar {
    width: 300px; /* 好きな幅に変更 */
}
```

### アニメーション速度を変更
`style.css` の `transition` の時間を変更：

```css
.sidebar {
    transition: left 0.3s ease; /* 0.3s を変更 */
}
```

## 技術的なポイント

- **CSSトランジション**: スムーズなアニメーション効果
- **JavaScript**: クラスの追加/削除で状態を管理
- **Font Awesome**: CDNからアイコンを読み込み
- **レスポンシブデザイン**: メディアクエリで画面サイズに対応
- **アクセシビリティ**: ESCキーやオーバーレイクリックで閉じる機能

## 使用しているアイコンライブラリ

Font Awesome 6.4.0 を使用しています。
CDNから読み込んでいるため、インターネット接続が必要です。

## 学習のポイント

1. サイドバーの表示/非表示の仕組みを理解する
2. アコーディオンの開閉アニメーションを確認する
3. CSSの `transform` と `transition` の使い方を学ぶ
4. JavaScriptでDOM要素を操作する方法を学ぶ

