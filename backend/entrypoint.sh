#!/bin/sh

set -e

echo "Waiting for PostgreSQL..."

#while ! nc -z postgres 5432; do
#    sleep 2
#done

echo "PostgreSQL is available"

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 2 \
    --timeout 120