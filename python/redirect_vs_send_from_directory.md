# `redirect()` と `send_from_directory()` の違い

## 基本的な違い

| 項目 | `redirect()` | `send_from_directory()` |
|------|-------------|------------------------|
| **用途** | 別のURLにリダイレクト | ファイルを直接送信 |
| **動作** | HTTPリダイレクト（302/301） | ファイルの内容を返す |
| **ブラウザの動作** | 新しいURLに移動 | ファイルをダウンロード/表示 |
| **レスポンス** | Locationヘッダーを設定 | ファイルの内容をボディに含める |

---

## 1. `redirect()` - リダイレクト

### 動作の流れ

```
クライアント → /login (POST) → redirect('/dashboard') → ブラウザが自動的に /dashboard に移動
```

### 使用例（あなたのコードから）

```python
# ログイン成功後、ダッシュボードにリダイレクト
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == USERNAME and password == PASSWORD:
            session['username'] = username
            return redirect(url_for('dashboard'))  # ← ここ
        return render_template('login.html', error='ログインに失敗しました。')
    return render_template('login.html', username='', error='')
```

### 実際のHTTPレスポンス

```
HTTP/1.1 302 Found
Location: /dashboard
Content-Type: text/html; charset=utf-8

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<title>Redirecting...</title>
<h1>Redirecting...</h1>
<p>You should be redirected automatically to target URL: <a href="/dashboard">/dashboard</a>.
```

**ブラウザは自動的に `/dashboard` に移動します**

---

## 2. `send_from_directory()` - ファイル送信

### 動作の流れ

```
クライアント → /uploaded/image.jpg → send_from_directory() → ファイルの内容を直接返す
```

### 使用例（あなたのコードから）

```python
# アップロードされたファイルを表示
@app.route('/uploaded/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)  # ← ここ
```

### 実際のHTTPレスポンス

```
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Length: 12345

[ファイルのバイナリデータ]
```

**ブラウザはファイルを直接表示/ダウンロードします**

---

## 視覚的な違い

### `redirect()` の場合

```
1. ユーザーが /login にアクセス
2. ログイン成功
3. redirect('/dashboard') を返す
4. ブラウザが自動的に /dashboard に移動
5. /dashboard の内容が表示される
```

**URLが変わる**: `/login` → `/dashboard`

### `send_from_directory()` の場合

```
1. ユーザーが /uploaded/image.jpg にアクセス
2. send_from_directory('uploads', 'image.jpg') を実行
3. ファイルの内容を直接返す
4. ブラウザが画像を表示
```

**URLは変わらない**: `/uploaded/image.jpg` のまま

---

## 具体的な使用シーン

### `redirect()` を使う場面

1. **ログイン後のリダイレクト**
   ```python
   if login_success:
       return redirect(url_for('dashboard'))
   ```

2. **フォーム送信後のリダイレクト**
   ```python
   if form_submitted:
       save_data()
       return redirect(url_for('success_page'))
   ```

3. **認証が必要なページへのアクセス**
   ```python
   if not authenticated:
       return redirect(url_for('login'))
   ```

4. **エラー後のリダイレクト**
   ```python
   if error:
       return redirect(url_for('error_page'))
   ```

### `send_from_directory()` を使う場面

1. **アップロードされたファイルの表示**
   ```python
   @app.route('/uploads/<filename>')
   def serve_file(filename):
       return send_from_directory('uploads', filename)
   ```

2. **静的ファイルの動的配信**
   ```python
   @app.route('/download/<filename>')
   def download_file(filename):
       return send_from_directory('downloads', filename, as_attachment=True)
   ```

3. **ユーザーごとのファイル配信**
   ```python
   @app.route('/user/<user_id>/avatar')
   def user_avatar(user_id):
       filename = f"{user_id}_avatar.jpg"
       return send_from_directory('avatars', filename)
   ```

---

## コード例で理解する

### 例1: ファイルアップロード後の処理

```python
@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join('uploads', filename))
    
    # redirect() を使う: 別のページに移動
    return redirect(url_for('uploaded_file', filename=filename))
    # → ブラウザは /uploaded/image.jpg に移動

@app.route('/uploaded/<filename>')
def uploaded_file(filename):
    # send_from_directory() を使う: ファイルを直接送信
    return send_from_directory('uploads', filename)
    # → ファイルの内容がそのまま返される
```

### 例2: ログイン処理

```python
@app.route('/login', methods=['POST'])
def login():
    if valid_credentials():
        session['user'] = username
        # redirect() を使う: ダッシュボードに移動
        return redirect(url_for('dashboard'))
        # → ブラウザは /dashboard に移動

@app.route('/dashboard')
def dashboard():
    # render_template() を使う: HTMLページを返す
    return render_template('dashboard.html')
    # → HTMLが返される
```

---

## 重要なポイント

### `redirect()` について

- ✅ **ページ遷移**に使う
- ✅ **URLが変わる**
- ✅ **ブラウザが2回リクエスト**（元のURL → リダイレクト先）
- ✅ **POSTリダイレクト後のGETリクエスト**（PRGパターン）

### `send_from_directory()` について

- ✅ **ファイル送信**に使う
- ✅ **URLは変わらない**
- ✅ **ブラウザが1回リクエスト**
- ✅ **セキュリティ**: ディレクトリトラバーサル攻撃を防ぐ
- ✅ **MIMEタイプ**: 自動的に適切なContent-Typeを設定

---

## セキュリティの違い

### `redirect()` の注意点

```python
# ⚠️ 危険: 外部サイトへのリダイレクト
redirect(request.args.get('next', '/'))  # オープンリダイレクト脆弱性

# ✅ 安全: url_for()を使う
redirect(url_for('dashboard'))
```

### `send_from_directory()` の安全性

```python
# ✅ 安全: ディレクトリトラバーサル攻撃を防ぐ
send_from_directory('uploads', filename)
# 例: filename = "../../../etc/passwd" でも安全

# ❌ 危険: 直接ファイルパスを使う
return open(f'uploads/{filename}', 'rb').read()  # 危険！
```

---

## まとめ

| 用途 | 使う関数 |
|------|---------|
| ログイン後に別ページへ移動 | `redirect()` |
| フォーム送信後に別ページへ移動 | `redirect()` |
| 認証が必要なページへのアクセス | `redirect()` |
| アップロードされたファイルを表示 | `send_from_directory()` |
| ファイルをダウンロードさせる | `send_from_directory()` |
| 静的ファイルを動的に配信 | `send_from_directory()` |

**覚え方**: 
- **`redirect()`** = 「**別の場所**に行く」
- **`send_from_directory()`** = 「**ファイル**を送る」
