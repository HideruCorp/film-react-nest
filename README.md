# FILM!

## Описание проекта

Онлайн-сервис бронирования билетов в кинотеатр. Проект состоит из:
- **Бэкенда** на Nest.js — REST API для управления фильмами, сеансами и заказами
- **Фронтенда** на React — пользовательский интерфейс для выбора фильма, сеанса и бронирования билетов

Данные хранятся в MongoDB. Бэкенд реализован по модульной архитектуре с разделением на контроллеры, сервисы и репозитории.

## Архитектура бэкенда

### Технологии
- **Nest.js** — фреймворк для бэкенда
- **TypeScript** — статическая типизация
- **MongoDB + Mongoose** — база данных и ODM
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
│   ├── repository.module.ts
│   ├── films.repository.interface.ts
│   ├── films.mongo.schema.ts
│   ├── films.mongo.repository.ts
│   ├── films.mongo.provider.ts
│   └── films.memory.repository.ts
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
- **Repository Pattern** — доступ к данным абстрагирован за интерфейсом `IFilmsRepository`
- **DTO классы** — типизация запросов и ответов через классы DTO
- **Exception Filter** — глобальный фильтр ошибок форматирует ответ в соответствии с OpenAPI спецификацией
- **Валидация бронирования** — сервис проверяет, что место не занято перед бронированием
- **Формат занятых мест** — `${row}:${seat}`, например `"2:5"`

## Установка и запуск

### MongoDB

1. Установите MongoDB (скачав дистрибутив с официального сайта или через пакетный менеджер)
2. Запустите MongoDB сервис
3. Импортируйте начальные данные (опционально):

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

Отредактируйте `.env` (при необходимости):

```env
DATABASE_DRIVER=mongodb
DATABASE_URL=mongodb://127.0.0.1:27017/practicum
DEBUG=*
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
