#!/bin/sh

shift
cmd="$@"

until pg_isready -h "db"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

npm install
node src/app.js

