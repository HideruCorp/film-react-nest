-- =============================================================
-- PART 1: run connected to database 'postgres' as superuser
-- psql:   psql -U postgres
-- pgAdmin: Query Tool on database 'postgres'
-- =============================================================

CREATE USER prac_user WITH PASSWORD 'prac_password';
CREATE DATABASE prac OWNER prac_user;

-- =============================================================
-- PART 2: run connected to database 'prac'
-- psql:   the \c below switches automatically
-- pgAdmin: close this Query Tool, open a new one on database 'prac'
--          then run everything from CREATE TABLE onward
-- =============================================================

\c prac prac_user

CREATE TABLE IF NOT EXISTS film
(
    id          UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    rating      DOUBLE PRECISION,
    director    VARCHAR,
    tags        TEXT[]           NOT NULL DEFAULT '{}',
    title       VARCHAR          NOT NULL,
    about       TEXT,
    description TEXT,
    image       VARCHAR,
    cover       VARCHAR
);

CREATE TABLE IF NOT EXISTS schedule
(
    id       UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    film_id  UUID             NOT NULL REFERENCES film (id) ON DELETE CASCADE,
    daytime  VARCHAR          NOT NULL,
    hall     INTEGER          NOT NULL,
    rows     INTEGER          NOT NULL,
    seats    INTEGER          NOT NULL,
    price    DOUBLE PRECISION NOT NULL,
    taken    TEXT[]           NOT NULL DEFAULT '{}'
);
