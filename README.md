## Deploy

```bash
curl -fsSL https://raw.githubusercontent.com/BADtochka/offmine/main/deploy.sh | sudo bash
```

Переменные окружения (опционально):

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DOMAIN` | `offmine.ru` | Домен для Caddy |
| `RUNNER` | `docker` | Способ запуска: `docker` или `pm2` |
| `CADDY` | `0` | Установить и настроить Caddy (`1` — включить) |
| `SERVERS` | _(локально)_ | Список SSH-серверов через пробел |
| `SSH_OPTS` | `-o StrictHostKeyChecking=no` | Доп. флаги для `ssh` |

```bash
# С Caddy (если не используется Cloudflare)
curl -fsSL https://raw.githubusercontent.com/BADtochka/offmine/main/deploy.sh | sudo CADDY=1 bash

# Деплой на несколько серверов
curl -fsSL https://raw.githubusercontent.com/BADtochka/offmine/main/deploy.sh \
  | SERVERS="root@1.2.3.4 root@5.6.7.8" bash
```

## Pterodactyl

1. **Панель → Nest → Import Egg** → загрузи [`egg-offmine.json`](./egg-offmine.json)
2. Создай сервер, выбери этот egg, назначь allocation (порт `3000`)
3. Нажми **Reinstall** — склонирует репо и соберёт проект
4. **Start**

Для обновления кода повторно нажми **Reinstall**.
