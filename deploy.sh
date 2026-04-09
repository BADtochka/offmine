#!/usr/bin/env bash
set -euo pipefail

# ─── config ───────────────────────────────────────────────────────────────────
REPO="https://github.com/BADtochka/offmine.git"
APP_DIR="/opt/offmine"
APP_NAME="offmine"
APP_PORT=3000
DOMAIN="${DOMAIN:-offmine.ru}"          # override: DOMAIN=example.com ./deploy.sh
RUNNER="${RUNNER:-docker}"              # override: RUNNER=pm2 ./deploy.sh
CADDY="${CADDY:-0}"                     # override: CADDY=1 ./deploy.sh
# Space-separated list of SSH targets, e.g. "root@1.2.3.4 root@5.6.7.8"
# If empty, runs locally.
SERVERS="${SERVERS:-}"
SSH_OPTS="${SSH_OPTS:--o StrictHostKeyChecking=no}"
# ──────────────────────────────────────────────────────────────────────────────

log()  { echo "[deploy] $*"; }
die()  { echo "[deploy] ERROR: $*" >&2; exit 1; }

need() { command -v "$1" &>/dev/null || die "'$1' not found — install it first"; }

# ─── remote dispatch ─────────────────────────────────────────────────────────
# If SERVERS is set, SSH into each one and re-run this script remotely.
# The script is piped via stdin so no prior setup is needed on the target.
if [[ -n "$SERVERS" ]]; then
  need ssh
  FAILED=()
  for SERVER in $SERVERS; do
    log "Deploying to $SERVER …"
    if DOMAIN="$DOMAIN" RUNNER="$RUNNER" CADDY="$CADDY" \
       ssh $SSH_OPTS "$SERVER" \
         "DOMAIN='$DOMAIN' RUNNER='$RUNNER' CADDY='$CADDY' bash -s" \
         < "$0"; then
      log "$SERVER — OK"
    else
      log "$SERVER — FAILED"
      FAILED+=("$SERVER")
    fi
  done
  if [[ ${#FAILED[@]} -gt 0 ]]; then
    die "Failed on: ${FAILED[*]}"
  fi
  exit 0
fi

# ─── 0. install bun ───────────────────────────────────────────────────────────
if ! command -v bun &>/dev/null; then
  log "Installing bun"
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

# ─── 1. pull ──────────────────────────────────────────────────────────────────
log "Pulling repo → $APP_DIR"
if [[ -d "$APP_DIR/.git" ]]; then
  git -C "$APP_DIR" pull --ff-only
else
  git clone "$REPO" "$APP_DIR"
fi

# ─── 2. caddy (optional) ─────────────────────────────────────────────────────
if [[ "$CADDY" == "1" ]]; then
  if ! command -v caddy &>/dev/null; then
    log "Installing Caddy"
    if command -v apt-get &>/dev/null; then
      apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
      curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
        | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
      curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
        | tee /etc/apt/sources.list.d/caddy-stable.list
      apt-get update -qq && apt-get install -y caddy
    elif command -v dnf &>/dev/null; then
      dnf install -y 'dnf-command(copr)'
      dnf copr enable -y @caddy/caddy
      dnf install -y caddy
    else
      die "Unsupported package manager — install Caddy manually: https://caddyserver.com/docs/install"
    fi
  fi

  log "Writing /etc/caddy/Caddyfile (domain: $DOMAIN → localhost:$APP_PORT)"
  mkdir -p /etc/caddy
  cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
    reverse_proxy localhost:$APP_PORT
}
EOF
else
  log "Skipping Caddy (proxied via Cloudflare). App will be available on port $APP_PORT"
fi

# ─── 3. build & run ──────────────────────────────────────────────────────────
if [[ "$RUNNER" == "docker" ]]; then
  need docker

  log "Building Docker image: $APP_NAME"
  if [[ ! -f "$APP_DIR/Dockerfile" ]]; then
    log "No Dockerfile found — generating one"
    cat > "$APP_DIR/Dockerfile" <<'DOCKERFILE'
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["bun", "server.js"]
DOCKERFILE
  fi

  docker build -t "$APP_NAME" "$APP_DIR"

  log "Stopping old container (if any)"
  docker rm -f "$APP_NAME" 2>/dev/null || true

  log "Starting container"
  docker run -d \
    --name "$APP_NAME" \
    --restart unless-stopped \
    -p "$APP_PORT:3000" \
    "$APP_NAME"

else
  need bun

  if ! command -v pm2 &>/dev/null; then
    log "Installing pm2"
    bun add -g pm2
  fi

  log "Installing dependencies"
  bun install --cwd "$APP_DIR" --frozen-lockfile

  log "Building"
  bun --cwd "$APP_DIR" run build

  log "Starting / restarting with pm2"
  pm2 describe "$APP_NAME" &>/dev/null \
    && pm2 restart "$APP_NAME" \
    || pm2 start bun \
        --name "$APP_NAME" \
        --cwd "$APP_DIR" \
        -- run start

  pm2 save
  pm2 startup || true
fi

# ─── 4. reload caddy ─────────────────────────────────────────────────────────
if [[ "$CADDY" == "1" ]]; then
  log "Reloading Caddy"
  if systemctl is-active --quiet caddy; then
    systemctl reload caddy
  else
    systemctl enable --now caddy
  fi
  log "Done. App proxied via Caddy at https://$DOMAIN"
else
  log "Done. App running on port $APP_PORT"
fi
