## Deploy

```bash
curl -fsSL https://raw.githubusercontent.com/BADtochka/offmine/main/deploy.sh | sudo bash
```

Переменные окружения (опционально):

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DOMAIN` | `offmine.ru` | Домен для Caddy |
| `RUNNER` | `docker` | Способ запуска: `docker` или `pm2` |

```bash
# Пример с кастомными параметрами
curl -fsSL https://raw.githubusercontent.com/BADtochka/offmine/main/deploy.sh | sudo DOMAIN=example.com RUNNER=pm2 bash
```
