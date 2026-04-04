#!/bin/bash
set -e

psql -h "$PGHOST" -U "$POSTGRES_USER" \
  -c "CREATE USER \"$DATABASE_USERNAME\" WITH PASSWORD '$DATABASE_PASSWORD';" || true

psql -h "$PGHOST" -U "$POSTGRES_USER" \
  -c "CREATE DATABASE \"$DATABASE_NAME\" OWNER \"$DATABASE_USERNAME\";" || true

export PGPASSWORD="$DATABASE_PASSWORD"

psql -h "$PGHOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -f /db/prac.init.sql

psql -h "$PGHOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -c "TRUNCATE schedule, film CASCADE;"

psql -h "$PGHOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -f /db/prac.films.sql

psql -h "$PGHOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -f /db/prac.schedules.sql
