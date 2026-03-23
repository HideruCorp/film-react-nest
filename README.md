# FILM!

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

### База данных

Бэкенд поддерживает два драйвера. Выберите один.

#### PostgreSQL (по умолчанию в `.env.example`)

1. Установите и запустите PostgreSQL.
2. Инициализируйте базу (создаёт пользователя `prac_user`, базу `prac` и таблицы):

```bash
psql -U postgres -f backend/test/prac.init.sql
```

3. Загрузите тестовые данные (опционально):

```bash
psql -U prac_user -d prac -f backend/test/prac.films.sql
psql -U prac_user -d prac -f backend/test/prac.schedules.sql
```

#### MongoDB

1. Установите и запустите MongoDB.
2. Импортируйте начальные данные (опционально):

```bash
# Через MongoDB Compass: Add Data → Import JSON or CSV file
# Файл: backend/test/mongodb_initial_stub.json
```

### Бэкенд

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

### Фронтенд

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

## Тестирование

Запуск тестов:

```bash
cd backend
npm test                # запуск всех тестов
npm test:watch          # запуск в watch-режиме
npm run test:cov        # запуск с покрытием кода
```

Проверка линтера:

```bash
npm run lint
```

Сборка проекта:

```bash
npm run build
```

## OpenAPI спецификация

Полное описание API находится в файле `film.yml` в корне проекта. Также доступна Postman-коллекция `film.postman.json`.
