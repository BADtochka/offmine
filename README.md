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

```bash
# С Caddy (если не используется Cloudflare)
curl -fsSL https://raw.githubusercontent.com/BADtochka/offmine/main/deploy.sh | sudo CADDY=1 bash
```
