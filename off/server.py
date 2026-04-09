from flask import Flask, request, render_template
import rcon

app = Flask(__name__)

# Параметры подключения к серверу Minecraft
RCON_HOST = '192.145.99.96'  # IP адрес или домен вашего Minecraft сервера
RCON_PORT = 25575        # Порт RCON вашего сервера Minecraft
RCON_PASSWORD = '1234'  # Пароль RCON

# Функция для добавления игрока в вайтлист
def add_to_whitelist(nickname):
    try:
        # Подключение к серверу через RCON
        with rcon.Rcon(RCON_HOST, RCON_PORT, RCON_PASSWORD) as client:
            # Отправка команды на сервер Minecraft
            response = client.command(f"whitelist add {nickname}")
            return response
    except Exception as e:
        return f"Ошибка при подключении к серверу: {e}"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        nickname = request.form['nickname']  # Получаем никнейм из формы
        email = request.form['email']  # Получаем email (можно использовать для подтверждения)
        
        if nickname:
            response = add_to_whitelist(nickname)
            return render_template('index.html', message=f"Никнейм {nickname} добавлен в вайтлист! Ответ от сервера: {response}")
        else:
            return render_template('index.html', message="Пожалуйста, введите никнейм.")
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
