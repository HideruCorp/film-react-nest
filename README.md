# FILM!

- Демо: [FILM!](https://film-daziev.students.nomorepartiessite.ru)
- API: [FILM! API](https://film-daziev.students.nomorepartiessite.ru/api/afisha/films)
- pgAdmin: [FILM! pgAdmin](https://film-daziev.students.nomorepartiessite.ru/admin/)

## Описание проекта

Онлайн-сервис бронирования билетов в кинотеатр. Проект состоит из:
- **Бэкенда** на Nest.js — REST API для управления фильмами, сеансами и заказами
- **Фронтенда** на React — пользовательский интерфейс для выбора фильма, сеанса и бронирования билетов

Данные хранятся в MongoDB или PostgreSQL — СУБД выбирается через переменную окружения `DATABASE_DRIVER` без изменения исходного кода. Бэкенд реализован по модульной архитектуре с разделением на контроллеры, сервисы и репозитории.

## Архитектура бэкенда

### Технологии
- **Nest.js** — фреймворк для бэкенда
- **TypeScript** — статическая типизация
- **MongoDB + Mongoose** — документная БД и ODM (драйвер `mongodb`)
- **PostgreSQL + TypeORM** — реляционная БД и ORM (драйвер `postgres`)
- **Jest** — тестирование
- **ESLint + Prettier** — линтер и форматтер кода

### Структура проекта

```
backend/src/
├── films/                 # Модуль фильмов
│   ├── films.controller.ts
│   ├── films.service.ts
│   ├── films.module.ts
│   └── dto/              # Data Transfer Objects
│       └── films.dto.ts
├── order/                 # Модуль заказов
│   ├── order.controller.ts
│   ├── order.service.ts
│   ├── order.module.ts
│   └── dto/
│       └── order.dto.ts
├── repository/            # Слой доступа к данным
│   ├── repository.module.ts            # Динамический выбор модуля по DATABASE_DRIVER
│   ├── films.repository.interface.ts   # Интерфейс IFilmsRepository и токен FILMS_REPOSITORY
│   ├── repository.mongo.module.ts      # MongoDB-модуль (MongooseModule)
│   ├── films.mongo.schema.ts           # Mongoose-схемы Film и Schedule
│   ├── films.mongo.repository.ts       # Реализация репозитория для MongoDB
│   ├── repository.postgres.module.ts   # PostgreSQL-модуль (TypeOrmModule)
│   ├── film.postgres.entity.ts         # TypeORM-сущность Film
│   ├── schedule.postgres.entity.ts     # TypeORM-сущность Schedule
│   └── films.postgres.repository.ts    # Реализация репозитория для PostgreSQL
├── filters/              # Обработка ошибок
│   └── http-exception.filter.ts
├── app.module.ts          # Корневой модуль
├── app.config.provider.ts # Провайдер конфигурации
└── main.ts               # Точка входа
```

### API эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/afisha/films/` | Список всех фильмов |
| GET | `/api/afisha/films/:id/schedule` | Расписание сеансов фильма |
| POST | `/api/afisha/order` | Создание заказа (бронирование билетов) |
| GET | `/content/afisha/*` | Статический контент (постеры, обложки) |

### Детали реализации

- **Конфигурация через .env** — все параметры приложения берутся из переменных окружения через `ConfigModule`
- **Dependency Injection** — все зависимости инжектируются через конструктор с использованием `@Inject()`
- **Repository Pattern** — доступ к данным абстрагирован за интерфейсом `IFilmsRepository`; реализации для MongoDB и PostgreSQL взаимозаменяемы
- **DTO классы** — типизация запросов и ответов через классы DTO
- **Exception Filter** — глобальный фильтр ошибок форматирует ответ в соответствии с OpenAPI спецификацией
- **Валидация бронирования** — сервис проверяет, что место не занято перед бронированием
- **Формат занятых мест** — `${row}:${seat}`, например `"2:5"`

## Установка и запуск

### Локальный запуск

#### База данных

Бэкенд поддерживает два драйвера. Выберите один.

##### PostgreSQL (по умолчанию в `.env.example`)

1. Установите и запустите PostgreSQL.
2. Создайте пользователя `prac_user` и базу `prac`:

```bash
psql -U postgres
```

```sql
CREATE USER prac_user WITH PASSWORD 'prac_password';
CREATE DATABASE prac OWNER prac_user;
\q
```

3. Инициализируйте схему таблиц:

```bash
psql -U prac_user -d prac -f backend/test/prac.init.sql
```

4. Загрузите тестовые данные (опционально):

```bash
psql -U prac_user -d prac -f backend/test/prac.films.sql
psql -U prac_user -d prac -f backend/test/prac.schedules.sql
```

##### MongoDB

1. Установите и запустите MongoDB.
2. Импортируйте начальные данные (опционально):

Через MongoDB Compass: Add Data → Import JSON or CSV file
Файл: backend/test/mongodb_initial_stub.json

#### Бэкенд

Перейдите в папку бэкенда:

```bash
cd backend
```

Установите зависимости:

```bash
npm ci
```

Создайте `.env` файл из примера:

```bash
cp .env.example .env
```

Отредактируйте `.env` под выбранную СУБД:

```env
# PostgreSQL
DATABASE_DRIVER=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=prac_user
DATABASE_PASSWORD=prac_password
DATABASE_NAME=prac

# MongoDB (альтернатива — замените строки выше на эти)
# DATABASE_DRIVER=mongodb
# DATABASE_URL=mongodb://127.0.0.1:27017/prac

DEBUG=*
PORT=3000
```

Запустите бэкенд:

```bash
npm run start:dev
```

Бэкенд будет доступен на `http://localhost:3000`

#### Фронтенд

Откройте новую консоль и перейдите в папку фронтенда:

```bash
cd frontend
```

Установите зависимости:

```bash
npm ci
```

Запустите фронтенд:

```bash
npm run dev
```

Фронтенд будет доступен на `http://localhost:5173`

### Docker-развёртывание на сервере

Этот вариант использует готовые образы из GHCR и root `docker-compose.yml`. На сервере не нужен исходный код приложения целиком — достаточно `docker-compose.yml`, `.env` и файлов инициализации в `backend/test/`.

**Подготовьте директорию на сервере:**

```bash
mkdir -p ~/film-app/backend/test
cd ~/film-app
```

**Скачайте compose, env-шаблон и init-файлы из репозитория:**

```bash
curl -fsSLO https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/.env.example
curl -fsSL https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/backend/test/init.sh -o backend/test/init.sh
curl -fsSL https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/backend/test/prac.init.sql -o backend/test/prac.init.sql
curl -fsSL https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/backend/test/prac.films.sql -o backend/test/prac.films.sql
curl -fsSL https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/backend/test/prac.schedules.sql -o backend/test/prac.schedules.sql
chmod 700 backend/test/init.sh
```

**Создайте production `.env`:**

```bash
cp .env.example .env
nano .env
chmod 600 .env
```

Пример значений:

```dotenv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_strong_postgres_password

PORT=3000
DATABASE_DRIVER=postgres
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_USERNAME=prac_user
DATABASE_PASSWORD=your_strong_app_password
DATABASE_NAME=prac
LOGGER_TYPE=json

PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=your_pgadmin_password
```

**Авторизуйтесь в GHCR и запустите сервисы:**

```bash
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
docker compose pull
docker compose up -d
```

`db-init` автоматически:
- создаёт пользователя `prac_user` и базу `prac`;
- применяет `backend/test/prac.init.sql`;
- загружает тестовые данные из `backend/test/prac.films.sql` и `backend/test/prac.schedules.sql`.

**Проверка:**

```bash
docker compose ps
docker compose logs -f backend
curl http://localhost:3000/api/afisha/films/
```

### Настройка HTTPS

Убедитесь, что в `.env` заданы переменные:

```dotenv
DOMAIN=ваш-домен.example.com
CERTBOT_EMAIL=ваш@email.com
```

Затем выполните на сервере:

```bash
mkdir -p ~/film-app/deploy/nginx
curl -fsSL https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/deploy/setup-https.sh -o deploy/setup-https.sh
curl -fsSL https://raw.githubusercontent.com/HideruCorp/film-react-nest/main/deploy/nginx/https.conf -o deploy/nginx/https.conf
chmod 700 deploy/setup-https.sh
bash deploy/setup-https.sh
```

Скрипт:
1. Устанавливает `certbot`
2. Временно останавливает контейнер `frontend` (освобождает порт 80)
3. Получает SSL-сертификат от Let's Encrypt через `certbot standalone`
4. Генерирует `deploy/nginx/https.active.conf` (подстановка домена через `envsubst`)
5. Генерирует `docker-compose.override.yml` — Docker Compose подхватывает его автоматически:
   - Контейнер `frontend` получает дополнительный порт `443:443`
   - Сертификаты монтируются из `/etc/letsencrypt` в контейнер
   - Сгенерированный nginx-конфиг монтируется поверх стандартного
6. Запускает `docker compose up -d`
7. Настраивает автоматическое обновление сертификата через `renewal-hooks`

После настройки приложение доступно по HTTPS. Обновление образов:

```bash
docker compose pull
docker compose up -d
docker image prune -f
```

## Тестирование

Запуск тестов:

```bash
cd backend
yarn test                # запуск всех тестов
yarn test:watch          # запуск в watch-режиме
yarn run test:cov        # запуск с покрытием кода
```

Проверка линтера:

```bash
yarn lint
```

Сборка проекта:

```bash
yarn build
```

## OpenAPI спецификация

Полное описание API находится в файле `film.yml` в корне проекта. Также доступна Postman-коллекция `film.postman.json`.
