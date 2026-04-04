#!/bin/bash
set -e

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ -f "$APP_DIR/.env" ]; then
  [ -z "$DOMAIN" ]         && DOMAIN="$(grep -E '^DOMAIN='         "$APP_DIR/.env" | cut -d= -f2 | tr -d '[:space:]')"
  [ -z "$CERTBOT_EMAIL" ]  && CERTBOT_EMAIL="$(grep -E '^CERTBOT_EMAIL=' "$APP_DIR/.env" | cut -d= -f2 | tr -d '[:space:]')"
fi

if [ -z "$DOMAIN" ]; then
  echo "Ошибка: переменная DOMAIN не задана." >&2
  echo "Добавьте DOMAIN=ваш-домен в .env или передайте: DOMAIN=ваш-домен bash deploy/setup-https.sh" >&2
  exit 1
fi

if [ -z "$CERTBOT_EMAIL" ]; then
  echo "Ошибка: переменная CERTBOT_EMAIL не задана." >&2
  echo "Добавьте CERTBOT_EMAIL=ваш@email в .env или передайте как переменную окружения." >&2
  exit 1
fi

echo "Домен: $DOMAIN"
echo "Email:  $CERTBOT_EMAIL"

echo "=== Установка certbot ==="
sudo apt-get update -q
sudo apt-get install -y certbot gettext-base

echo "=== Остановка frontend для освобождения порта 80 ==="
cd "$APP_DIR"
docker compose stop frontend

echo "=== Получение SSL-сертификата (certbot standalone) ==="
sudo certbot certonly --standalone \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "$CERTBOT_EMAIL"

echo "=== Генерация nginx-конфига ==="
export DOMAIN
envsubst '${DOMAIN}' < "$APP_DIR/deploy/nginx/https.conf" > "$APP_DIR/deploy/nginx/https.active.conf"

echo "=== Генерация docker-compose.override.yml ==="
cat > "$APP_DIR/docker-compose.override.yml" << EOF
services:
  frontend:
    ports:
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./deploy/nginx/https.active.conf:/etc/nginx/conf.d/default.conf:ro
EOF

echo "=== Запуск стека с HTTPS ==="
docker compose up -d

echo "=== Настройка автоматического обновления сертификата ==="
sudo mkdir -p /etc/letsencrypt/renewal-hooks/pre /etc/letsencrypt/renewal-hooks/post

sudo tee /etc/letsencrypt/renewal-hooks/pre/stop-frontend.sh > /dev/null << EOF
#!/bin/bash
cd $APP_DIR && docker compose stop frontend
EOF

sudo tee /etc/letsencrypt/renewal-hooks/post/start-frontend.sh > /dev/null << EOF
#!/bin/bash
cd $APP_DIR && docker compose up -d frontend
EOF

sudo chmod +x \
  /etc/letsencrypt/renewal-hooks/pre/stop-frontend.sh \
  /etc/letsencrypt/renewal-hooks/post/start-frontend.sh

echo ""
echo "=== Готово! Приложение доступно по адресу: https://${DOMAIN} ==="
