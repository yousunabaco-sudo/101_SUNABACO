from flask import Flask, request, redirect, url_for
from flask import render_template, abort, session, jsonify, send_from_directory, flash
from werkzeug.utils import secure_filename
import os
from markupsafe import escape

app = Flask(__name__)

# ===============================
# 問題1
# ===============================
@app.route('/hello/')
@app.route('/hello/<name>')
def hello_name(name=''):
    if name == '':
        name = 'ゲスト'
    return f'こんにちは、{escape(name)}さん！'

# ===============================
# 問題2
# ===============================
@app.route('/calculator', methods=['GET', 'POST'])
def calculator():
    if request.method == 'POST':
        num1 = request.form['num1']
        num2 = request.form['num2']
        operator = request.form['operator']
        if (operator == '/') and (num2 == '0'):
            result='0で割ることはできません'
        else:
            result = eval(f'{num1} {operator} {num2}')
        return render_template('calculator.html', num1=num1, num2=num2, operator=operator, result=result)
    return render_template('calculator.html', num1='', num2='', operator='+', result='')

# ===============================
# 問題３
# ===============================
products = [
    {"id": 1, "name": "ノートPC", "price": 89800, "description": "高性能なノートパソコン"},
    {"id": 2, "name": "マウス", "price": 1980, "description": "ワイヤレスマウス"},
    {"id": 3, "name": "キーボード", "price": 3980, "description": "メカニカルキーボード"},
]

@app.route('/products')
def products_page():
    return render_template('products.html', products=products)

@app.route('/product/<int:id>')
def product_detail(id):
    product = None
    for p in products:
        if p['id'] == id:
            product = p
            break
    if product is None:
        abort(404)
    return render_template('product_detail.html', product=product)

# ===============================
# 問題4
# ===============================
USERNAME = 'admin'
PASSWORD = 'password12345'

app.secret_key = 'OkIJUhYgTgTfRf12Nja'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == USERNAME and password == PASSWORD:
            session['username'] = username
            flash('ログインに成功しました。')
            return redirect(url_for('dashboard'))
        return render_template('login.html', error='ログインに失敗しました。')
    return render_template('login.html', username='', error='')

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['username'])

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('ログアウトしました。')
    return redirect(url_for('login'))

# ===============================
# 問題5
# ===============================
users = [
    {"id": 1, "name": "山田太郎", "email": "yamada@example.com", "age": 22},
    {"id": 2, "name": "佐藤花子", "email": "sato@example.com", "age": 33},
    {"id": 3, "name": "鈴木一郎", "email": "suzuki@example.com", "age": 24},
]

@app.route('/api/users')
def get_users():
    return jsonify(users)

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if user is None:
        abort(404)
    return jsonify(user)

# ===============================
# 問題6
# ===============================
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join('uploads', filename))
            return redirect(url_for('uploaded_file', filename=filename))
        return render_template('upload.html', error='ファイルのアップロードに失敗しました。')
    return render_template('upload.html', filename='')

@app.route('/uploaded/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

# ===============================
# 問題８
# ===============================
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

# ===============================
# 問題9
# ===============================
@app.route('/old-page')
def old_page():
    flash('ページが移動しました。')
    return redirect(url_for('new_page'))

@app.route('/new-page')
def new_page():
    return render_template('new_page.html')
