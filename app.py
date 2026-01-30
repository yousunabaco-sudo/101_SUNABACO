import sqlite3
from flask import Flask, request, redirect, url_for, render_template, abort
from flask import session, flash

app = Flask(__name__)


@app.errorhandler(404)
def not_found(e):
    """404のときは専用テンプレートを表示"""
    return render_template('404.html'), 404

# SQLiteデータベースのパス（プロジェクト直下に作成）
DATABASE = 'blog.db'

# ログイン情報
USERNAME = 'admin'
PASSWORD = 'password12345'

# セッションキー
app.secret_key = 'session_secret_key_sunabaco'

# データベースに接続
def get_db():
    """DB接続を取得（リクエストごとに接続）"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # カラム名でアクセス可能にする
    return conn

# テーブルを作成
def init_db():
    """テーブルを作成"""
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# 1ページあたりの記事数
PER_PAGE = 4


# トップページ
@app.route('/')
def index():
    """投稿一覧をDBから取得して表示（ページネーション）"""
    page = request.args.get('page', 1, type=int)
    if page < 1:
        page = 1
    conn = get_db()
    total = conn.execute('SELECT COUNT(*) FROM posts').fetchone()[0]
    total_pages = max(1, (total + PER_PAGE - 1) // PER_PAGE)
    page = min(page, total_pages)
    offset = (page - 1) * PER_PAGE
    rows = conn.execute(
        'SELECT id, title, body, created_at FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
        (PER_PAGE, offset)
    ).fetchall()
    conn.close()
    return render_template(
        'list.html',
        posts=rows,
        page=page,
        total_pages=total_pages,
        total=total,
        has_prev=page > 1,
        has_next=page < total_pages,
    )

# 投稿詳細
@app.route('/post/<int:post_id>')
def post(post_id):
    """投稿詳細をDBから取得して表示"""
    conn = get_db()
    row = conn.execute('SELECT id, title, body, created_at FROM posts WHERE id = ?', (post_id,)).fetchone()
    conn.close()
    if row is None:
        abort(404)
    return render_template('post.html', post=row)

# 投稿作成時のバリデーション
def validate_post_form(title: str, body: str) -> list[str]:
    """タイトル・本文をチェックし、エラーメッセージのリストを返す（空ならOK）"""
    errors = []
    title = (title or '').strip()
    body = (body or '').strip()
    if not title:
        errors.append('タイトルを入力してください。')
    elif len(title) > 200:
        errors.append('タイトルは200文字以内で入力してください。')
    if not body:
        errors.append('本文を入力してください。')
    elif len(body) > 10000:
        errors.append('本文は10000文字以内で入力してください。')
    return errors


# 投稿作成
@app.route('/post/new', methods=['GET', 'POST'])
def new_post():
    """ログインしていない場合はログインページへリダイレクト"""
    if 'username' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        title = request.form.get('title', '')
        body = request.form.get('body', '')
        errors = validate_post_form(title, body)
        if errors:
            for msg in errors:
                flash(msg, 'error')
            return render_template('new_post.html', title=title, body=body)
        conn = get_db()
        conn.execute('INSERT INTO posts (title, body) VALUES (?, ?)', (title.strip(), body.strip()))
        conn.commit()
        conn.close()
        flash('投稿しました。')
        return redirect('/')
    return render_template('new_post.html')


# 投稿編集
@app.route('/post/<int:post_id>/edit', methods=['GET', 'POST'])
def edit_post(post_id):
    """ログインしていない場合はログインページへリダイレクト"""
    if 'username' not in session:
        return redirect(url_for('login'))
    conn = get_db()
    row = conn.execute('SELECT id, title, body, created_at FROM posts WHERE id = ?', (post_id,)).fetchone()
    if row is None:
        conn.close()
        abort(404)
    if request.method == 'POST':
        title = request.form.get('title', '')
        body = request.form.get('body', '')
        errors = validate_post_form(title, body)
        if errors:
            conn.close()
            for msg in errors:
                flash(msg, 'error')
            return render_template('edit_post.html', post=row, title=title, body=body)
        conn.execute('UPDATE posts SET title = ?, body = ? WHERE id = ?', (title.strip(), body.strip(), post_id))
        conn.commit()
        conn.close()
        flash('記事を更新しました。')
        return redirect(url_for('post', post_id=post_id))
    conn.close()
    return render_template('edit_post.html', post=row, title=row['title'], body=row['body'] or '')


# 投稿削除
@app.route('/post/<int:post_id>/delete', methods=['POST'])
def delete_post(post_id):
    """ログインしていない場合はログインページへリダイレクト"""
    if 'username' not in session:
        return redirect(url_for('login'))
    conn = get_db()
    row = conn.execute('SELECT id FROM posts WHERE id = ?', (post_id,)).fetchone()
    if row is None:
        conn.close()
        abort(404)
    conn.execute('DELETE FROM posts WHERE id = ?', (post_id,))
    conn.commit()
    conn.close()
    flash('記事を削除しました。')
    return redirect(url_for('index'))


# ログイン
@app.route('/login', methods=['GET', 'POST'])
def login():
    """ログインフォームを表示"""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == USERNAME and password == PASSWORD:
            session['username'] = username
            flash('ログインに成功しました。')
            return redirect('/')
        flash('ログインに失敗しました。')
    return render_template('login.html')

# ログアウト
@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('ログアウトしました。')
    return redirect('/')