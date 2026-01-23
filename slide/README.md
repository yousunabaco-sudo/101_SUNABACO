# 全画面スライドショー

## 使い方

1. `index.html` をブラウザで開くだけです！

現在、サンプル画像としてUnsplash（無料の高品質画像サービス）の画像を使用しています。
インターネット接続が必要です。

## カスタマイズ方法

### 画像の数を変更する場合

1. `index.html` のスライド要素（`<div class="slide fade">`）を追加または削除
2. 画像のURL（`src="..."`）を変更

### 自分の画像を使う場合

1. `images` フォルダを作成
2. 画像ファイルを配置（例：`image1.jpg`）
3. `index.html` の画像URLを `src="images/image1.jpg"` のように変更

### 切り替え時間を変更する場合

`script.js` の最後の行を変更してください：
```javascript
setInterval(nextSlide, 3000); // 3000 = 3秒、5000 = 5秒など
```

### 画像の表示方法を変更する場合

`style.css` の `.slide img` の `object-fit` プロパティを変更：
- `cover`: 画像を画面いっぱいに表示（現在の設定）
- `contain`: 画像全体を表示（余白が出る場合あり）
- `fill`: 画像を引き伸ばして表示

