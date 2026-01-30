from flask import Flask, request, redirect, url_for
from markupsafe import escape
from urllib.parse import quote, unquote

app = Flask(__name__)

# ============================================
# 基本的な動的ルーティング（空白を含む名前）
# ============================================

@app.route('/hello/<name>')
def hello_name(name):
    """
    空白を含む名前の例:
    - /hello/John%20Doe  → name = "John Doe"
    - /hello/Tanaka%20Taro  → name = "Tanaka Taro"
    
    Flaskは自動的にURLデコードするので、%20は空白に変換されます
    """
    # 空白を含む名前も正しく処理される
    return f'こんにちは、{escape(name)}さん！'


# ============================================
# pathコンバーターを使った例（スラッシュも受け入れ）
# ============================================

@app.route('/user/<path:username>')
def user_profile(username):
    """
    pathコンバーターを使うと、スラッシュも含めて受け入れられます
    例: /user/john/doe → username = "john/doe"
    
    空白も含めて正しく処理されます
    """
    return f'ユーザー名: {escape(username)}'


# ============================================
# クエリパラメータで空白を扱う例
# ============================================

@app.route('/search')
def search():
    """
    クエリパラメータで空白を扱う例
    /search?q=hello%20world → q = "hello world"
    /search?q=hello+world → q = "hello world" (+も空白として解釈される)
    """
    query = request.args.get('q', '')
    return f'検索クエリ: {escape(query)}'


# ============================================
# url_for()で空白を含むURLを生成する例
# ============================================

@app.route('/')
def index():
    """
    url_for()を使うと、自動的にURLエンコードされます
    """
    # 空白を含む名前をURLに含める場合
    name_with_space = "John Doe"
    
    # url_for()は自動的にエンコードする
    url = url_for('hello_name', name=name_with_space)
    # 結果: /hello/John%20Doe
    
    return f'''
    <h1>動的ルーティングの例</h1>
    <ul>
        <li><a href="{url}">空白を含む名前: {name_with_space}</a></li>
        <li><a href="/hello/Tanaka%20Taro">直接URL: Tanaka Taro</a></li>
        <li><a href="/hello/Yamada%20Hanako">直接URL: Yamada Hanako</a></li>
        <li><a href="/search?q=hello%20world">クエリパラメータ: hello world</a></li>
        <li><a href="/user/john/doe">pathコンバーター: john/doe</a></li>
    </ul>
    '''


# ============================================
# 手動でエンコード/デコードする例
# ============================================

@app.route('/encode/<name>')
def encode_example(name):
    """
    手動でエンコード/デコードする例
    """
    # URLエンコード（%20などに変換）
    encoded = quote(name, safe='')
    
    # URLデコード（%20を空白に変換）
    decoded = unquote(name)
    
    return f'''
    <h2>エンコード/デコードの例</h2>
    <p>元の値: {escape(name)}</p>
    <p>エンコード後: {escape(encoded)}</p>
    <p>デコード後: {escape(decoded)}</p>
    '''


# ============================================
# 空白を処理する実用的な例
# ============================================

@app.route('/greet/<name>')
def greet(name):
    """
    空白を含む名前を処理する実用的な例
    """
    # 前後の空白を削除
    name = name.strip()
    
    # 複数の空白を1つに統一
    name = ' '.join(name.split())
    
    # 空の場合はデフォルト値を使用
    if not name:
        name = 'ゲスト'
    
    return f'こんにちは、{escape(name)}さん！'


if __name__ == '__main__':
    app.run(debug=True)
