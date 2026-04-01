#!/bin/sh

echo "Waiting for MySQL..."

until nc -z db 3306; do
  echo "DB not ready..."
  sleep 2
done

echo "MySQL is ready!"

python manage.py migrate

exec python manage.py runserver 0.0.0.0:8000