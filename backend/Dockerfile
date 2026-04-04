FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
# Приложение слушает порт из переменной окружения PORT (по умолчанию 3000)
EXPOSE 3000
CMD ["node", "dist/main.js"]
