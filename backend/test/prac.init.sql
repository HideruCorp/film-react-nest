-- =============================================================
-- Запустить подключившись к базе 'prac' от имени prac_user
-- psql:   psql -U prac_user -d prac
-- pgAdmin: Query Tool на базе 'prac'
-- В Docker: выполняется автоматически через db/init.sh
-- =============================================================

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
