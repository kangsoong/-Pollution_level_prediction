import threading

import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from datetime import datetime, timedelta
from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_mysqldb import MySQL
import pymysql
import joblib
import datetime
from PyP100 import PyP100

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'  # MySQL 호스트명
app.config['MYSQL_USER'] = 'root'  # MySQL 사용자명
app.config['MYSQL_PASSWORD'] = 'passwd'  # MySQL 비밀번호
app.config['MYSQL_DB'] = 'jspdb'  # MySQL 데이터베이스 이름
mysql = MySQL(app)

# Connect to MySQL database
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='passwd',
    db='jspdb'
)
cursor = conn.cursor()




def fetch_realtime_data(parameter):
    query = f"SELECT day, {parameter} FROM sensor_table ORDER BY day DESC LIMIT 1"
    cursor.execute(query)
    result = cursor.fetchone()
    return result

def fetch_historical_data(parameter):
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='passwd',
        db='jspdb'
    )
    cursor = conn.cursor()
    query = f"SELECT day, {parameter} FROM sensor_table ORDER BY day DESC LIMIT 20"
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    return result

def predict_next_value(model, historical_data, latest_time):
    X = np.array([pd.to_datetime(data[0], format='%Y-%m-%d %H:%M:%S').timestamp() for data in historical_data]).reshape(-1, 1)
    y = np.array([data[1:] for data in historical_data])

    imputer = SimpleImputer()
    X = imputer.fit_transform(X)
    y = imputer.fit_transform(y)

    model.fit(X, y.ravel())


    latest_time = latest_time.timestamp()
    latest_time = np.array(latest_time).reshape(-1, 1)

    y_pred = model.predict(latest_time)
    return y_pred[0]

# 모델 로드
models = {
    'pm2_5': joblib.load('AiR_Predictor_RF.pkl'),
    'pm10': joblib.load('pm10.pkl'),
    'o3': joblib.load('o3.pkl'),
    'co': joblib.load('co.pkl'),
    'co2': joblib.load('co.pkl')
}
next_pm25 = None
next_pm10 = None
next_o3 = None
next_co = None
next_co2 = None
def update_data():
    global next_pm25, next_pm10, next_o3, next_co, next_co2,next_day
    # 데이터 조회
    parameters = ['pm2_5', 'pm10', 'o3', 'co','co2']
    historical_data = {param: fetch_historical_data(param) for param in parameters}
    latest_data = {param: fetch_realtime_data(param) for param in parameters}
    # 다음 값을 예측
    if latest_data['pm2_5'] is None:
        next_day = None
        next_pm25 = None
        next_pm10 = None
        next_o3 = None
        next_co = None
        next_co2 = None
    else:
        latest_time = pd.to_datetime(latest_data['pm2_5'][0], format='%Y-%m-%d %H:%M:%S')
        # 다음 값을 예측
        next_values = {
            param: predict_next_value(models[param], historical_data[param], latest_time) for param in parameters
        }
        next_day = latest_time + timedelta(days=1)
        next_pm25 = next_values['pm2_5']
        next_pm10 = next_values['pm10']
        next_o3 = next_values['o3']
        next_co = next_values['co']
        next_co2 = next_values['co2']
    print(next_day, next_pm25, next_pm10, next_o3, next_co,next_co2)

def start_data_update_thread():
    update_thread = threading.Thread(target=update_data)
    update_thread.daemon = True
    update_thread.start()
try:
    conn = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        db=app.config['MYSQL_DB'],
        cursorclass=pymysql.cursors.DictCursor
    )
    # MySQL과의 연결 확인
    cur = mysql.connection.cursor()
    cur.execute("SELECT VERSION()")
    result = cur.fetchone()
    print("MySQL version : {}".format(result))
    cur.close()
except Exception as e:
    print("Error while connecting to MySQL", e)
    cur = None

# 로그인 페이지 렌더링
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # 로그인 버튼을 눌렀을 때
        username = request.form['username']
        password = request.form['password']

        # 아이디와 비밀번호를 확인하는 코드 작성
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM user_info WHERE username=%s AND password=%s", (username, password))
        user = cur.fetchone()
        cur.close()

        if user:
            # 로그인이 성공하면 index.html 페이지로 이동
            return redirect(url_for('index'))
        else:
            # 로그인이 실패하면 에러 메시지를 포함한 login.html 페이지 렌더링
            error = '아이디나 비밀번호가 일치하지 않습니다.'
            return render_template('login.html', error=error)
    else:
        # GET 요청일 때
        return render_template('login.html')


# 회원가입 페이지 렌더링
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # 폼에서 입력한 값 가져오기
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        # MySQL에 회원 정보 등록하기
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM user_info WHERE username=%s", (username,))
        user = cur.fetchone()
        if user:
            # 중복된 아이디가 있는 경우
            error = '중복된 아이디입니다.'
            return render_template('register.html', error=error)
        else:
            # 중복된 아이디가 없는 경우
            cur.execute("INSERT INTO user_info (name, username, password, email) VALUES (%s, %s, %s, %s)", (name, username, password, email))
            mysql.connection.commit()
            cur.close()
            #회원가입 완료 후 로그인 페이지로 이동
            return redirect(url_for('login'))
        #GET 요청인 경우 회원가입 페이지 렌더링
    return render_template('register.html')




@app.route('/index')
def index():
    try:
        conn = pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            db=app.config['MYSQL_DB'],
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = conn.cursor()
        cur.execute("SELECT * FROM sensor_table ORDER BY day DESC LIMIT 1")
        sensor_data = cur.fetchone()
        cur.close()

        start_data_update_thread()
        air_purifier_running = request.args.get('air_purifier_running') == 'True'
        air_manual_operation = request.args.get('air_manual_operation', 0)

        return render_template('index.html', sensor_data=sensor_data, next_pm25=next_pm25, next_day=next_day,
                               next_pm10=next_pm10, next_o3=next_o3, next_co=next_co, next_co2=next_co2,
                               air_purifier_running=air_purifier_running, air_manual_operation=air_manual_operation)
    except Exception as e:
        print("Error while fetching sensor data from MySQL", e)

    return render_template('index.html', sensor_data=sensor_data, next_pm25=None, next_day=None, next_pm10=None, next_o3=None, next_co=None, next_co2=None)

@app.route('/pm2.5')
def pm25():
    return render_template('pm2.5.html')

@app.route('/pm10')
def pm10():
    return render_template('pm10.html')

@app.route('/o3')
def o3():
    return render_template('o3.html')

@app.route('/co2')
def co2():
    return render_template('co2.html')

@app.route('/co')
def co():
    return render_template('co.html')

def replace_outlier_with_mean(data, recent_values):
    mean_value = np.mean(recent_values)
    return mean_value

@app.route('/sensor', methods=['POST'])
def sensor():
    data = request.form['data']  # POST 요청으로 전달된 데이터 받기
    username, co2, co, o3, pm10, pm2_5 = data.split(',')  # 쉼표로 분리하여 변수에 저장
    co2_num = 0
    co_num = 0
    o3_num = 0
    pm10_num = 0
    pm2_5_num = 0
    co2 = float(co2)/3
    # 데이터베이스에 저장하기 위한 딕셔너리 생성
    sensor_data = {'username': str(username), 'co2': float(co2), 'co': float(co), 'o3': float(o3), 'pm10': float(pm10),
                   'pm2_5': float(pm2_5)}

    try:
        # 데이터베이스 연결
        conn = pymysql.connect(host='localhost', user='root', password='passwd', db='jspdb')
        # 커서 생성
        cursor = conn.cursor()
        # 쿼리 실행
        # 데이터베이스에서 각 센서 데이터의 최근 10개 값 가져오기
        cursor.execute("SELECT co FROM sensor_table ORDER BY day DESC LIMIT 10")
        co_values = cursor.fetchall()

        cursor.execute("SELECT co2 FROM sensor_table ORDER BY day DESC LIMIT 10")
        co2_values = cursor.fetchall()

        cursor.execute("SELECT o3 FROM sensor_table ORDER BY day DESC LIMIT 10")
        o3_values = cursor.fetchall()

        cursor.execute("SELECT pm10 FROM sensor_table ORDER BY day DESC LIMIT 10")
        pm10_values = cursor.fetchall()

        cursor.execute("SELECT pm2_5 FROM sensor_table ORDER BY day DESC LIMIT 10")
        pm2_5_values = cursor.fetchall()

        # 각 센서 데이터의 최근 10개 값의 평균 계산
        co_average = np.mean(co_values)
        co2_average = np.mean(co2_values)
        o3_average = np.mean(o3_values)
        pm10_average = np.mean(pm10_values)
        pm2_5_average = np.mean(pm2_5_values)
        # 이상치가 있는 경우 대체
        if float(co) > 3 * co_average:  # co 값이 3배 이상이면 대체값으로 평균 사용
            if (co_num <= 2):
                sensor_data['co'] = co_average
                co_num += 1
            else:
                co_num = 0
        if float(co2) > 3 * co2_average:  # co2 값이 3배 이상이면 대체값으로 평균 사용
            if (co2_num <= 2):
                sensor_data['co2'] = co2_average
                co2_num += 1
        if float(o3) > 3 * o3_average:  # o3 값이 3배 이상이면 대체값으로 평균 사용
            if (o3_num <= 2):
                sensor_data['o3'] = o3_average
                o3_num += 1
        else:
            o3_num = 0
        if float(pm10) > 3 * pm10_average:  # pm10 값이 3배 이상이면 대체값으로 평균 사용
            if (pm10_num <= 2):
                sensor_data['pm10'] = pm10_average
                pm10_num += 1
        else:
            pm10_num = 0
        if float(pm2_5) > 3 * pm2_5_average:
            if (pm2_5_num <= 2):
                sensor_data['pm2_5'] = pm2_5_average
                pm2_5_num += 1
        else:
            co_num = 0

        current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        sensor_data['day'] = current_time

        cursor.execute("INSERT INTO sensor_table (day, co, co2, o3, pm10, pm2_5) VALUES (%s, %s, %s, %s, %s, %s)",
                       (sensor_data['day'], sensor_data['co'], sensor_data['co2'], sensor_data['o3'],
                        sensor_data['pm10'], sensor_data['pm2_5']))
        # 변경 사항 저장
        conn.commit()
        # 연결 종료
        conn.close()
        return render_template('index.html', data=data)
    except Exception as e:
    # 오류 발생 시 오류 메시지 반환
        return str(e)
# 센서 데이터 반환
@app.route('/sensor_data')
def get_sensor_data():
    try:
        conn = pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            db=app.config['MYSQL_DB'],
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = conn.cursor()
        cur.execute("SELECT * FROM sensor_table ORDER BY day DESC LIMIT 10")
        sensor_data = cur.fetchall()
        cur.close()

        return jsonify(sensor_data)
    except Exception as e:
        print("Error while fetching sensor data from MySQL", e)

    return jsonify([])
# Control P100 device
@app.route('/control_p100', methods=['POST'])
def control_p100():
    action = request.form['action']  # Get the value of 'action' from the form data

    p100 = PyP100.P100('192.168.148.67', 'wbgur12345@naver.com', 'wngur0624')
    p100.handshake()
    p100.login()

    air_purifier_running = False
    air_manual_operation = 0

    if action == '공기청정기 작동':
        p100.turnOn()  # Call the P100 device method to turn it on
        air_purifier_running = True
        air_manual_operation = 1
    elif action == '공기청정기 중지':
        p100.turnOff()  # Call the P100 device method to stop it
        air_purifier_running = False
        air_manual_operation = 0
        # 인덱스 페이지로 이동합니다.

        # 만약 action이 air_manual_operation 값을 가져오기 위한 것인지 확인합니다.
    if action == 'get_air_manual_operation':
        # air_manual_operation 값을 JSON 응답으로 반환합니다.
        return jsonify({'air_manual_operation': air_manual_operation})


        # 인덱스 페이지로 리디렉션하면서 air_purifier_running과 air_manual_operation을 전달합니다.
    return redirect(
        url_for('index', air_purifier_running=air_purifier_running, air_manual_operation=air_manual_operation))

if __name__ == '__main__':
    start_data_update_thread()
    app.run(host='0.0.0.0', port=8888)  # Flask 서버 실행