from flask import Flask
from markupsafe import escape

app = Flask(__name__)

# ============================================
# 問題1の解答例: 基本的なルーティングと変数ルール
# ============================================

@app.route('/hello')
@app.route('/hello/<name>')
def hello(name=None):
    """
    2つのルートを同じ関数にマッピング
    
    - /hello → name=None → 「ゲストさん」
    - /hello/<name> → nameに値が入る → 「{name}さん」
    
    HTMLエスケープを忘れずに実装
    """
    if name is None or name == '':
        name = 'ゲスト'
    
    # HTMLエスケープを忘れずに！
    # ユーザー入力は必ずエスケープしてXSS攻撃を防ぐ
    return f'こんにちは、{escape(name)}さん！'


# ============================================
# 別の実装方法（より明示的）
# ============================================

@app.route('/greet')
def greet_default():
    """名前が指定されていない場合のルート"""
    return 'こんにちは、ゲストさん！'


@app.route('/greet/<name>')
def greet_name(name):
    """名前が指定されている場合のルート"""
    # HTMLエスケープを忘れずに
    return f'こんにちは、{escape(name)}さん！'


# ============================================
# テスト用のルート
# ============================================

@app.route('/')
def index():
    """テスト用のインデックスページ"""
    return '''
    <h1>問題1の解答例 - テストページ</h1>
    <h2>方法1: 同じ関数に複数のルートをマッピング</h2>
    <ul>
        <li><a href="/hello">/hello（名前なし）</a></li>
        <li><a href="/hello/太郎">/hello/太郎</a></li>
        <li><a href="/hello/花子">/hello/花子</a></li>
        <li><a href="/hello/John%20Doe">/hello/John Doe（空白を含む）</a></li>
        <li><a href="/hello/<script>alert('XSS')</script>">XSSテスト（エスケープ確認）</a></li>
    </ul>
    
    <h2>方法2: 別々の関数で処理</h2>
    <ul>
        <li><a href="/greet">/greet（名前なし）</a></li>
        <li><a href="/greet/太郎">/greet/太郎</a></li>
        <li><a href="/greet/花子">/greet/花子</a></li>
    </ul>
    
    <h2>重要なポイント</h2>
    <ul>
        <li>✅ HTMLエスケープを必ず実装（XSS攻撃を防ぐ）</li>
        <li>✅ 名前が空の場合のデフォルト値処理</li>
        <li>✅ 複数のルートを同じ関数にマッピング可能</li>
        <li>✅ 空白を含む名前も正しく処理される</li>
    </ul>
    '''


if __name__ == '__main__':
    app.run(debug=True)
