# Meals

## Description

This is a website for managing meals (e.g. recipes, menus, shopping lists, etc.).

## Technologies

Front-end / web:

- FontAwesome
- Mantine
- React
- TypeScript

Back-end / API:

- Celery
- Django
- mypy
- PostgreSQL
- Python
- Redis

## Setting Up a Development Environment

The following assumes the use of a Linux (Ubuntu 20.04) development environment.

- Install programming language version managers (see external instructions):

  - [pyenv](https://github.com/pyenv/pyenv)
  - [nodenv](https://github.com/nodenv/nodenv)

- Install Python:

  ```sh
  cd api
  PYTHON_VERSON=$(awk -F/ '{print $1}' .python-version)
  pyenv install $PYTHON_VERSION
  ```

- Install [Poetry](https://python-poetry.org) for Python dependency management.

- Install Node.js:

  ```sh
  cd web
  NODE_VERSION=$(cat .node-version)
  nodenv install $NODE_VERSION
  ```

- Install [PostgreSQL](https://www.postgresql.org/) (tested on version 12.8):

  ```sh
  sudo apt update -y
  sudo apt install postgresql postgresql-contrib
  ```

- Configure PostgreSQL:

  ```sh
  sudo service postgresql start
  sudo -u postgres createuser --interactive

    Enter name of role to add: meals
    Shall the new role be a superuser? (y/n) y

  sudo -u postgres createdb meals
  sudo -u postgres psql

    alter user meals password '$PASSWORD';
    \q

  psql -d meals -U meals -W # Test that user and privileges work.

    create table testtable (id serial primary key, testcol text);
    drop table testtable;
    \q
  ```

- Install [Redis](https://redis.io/) (tested on version 6.0.6):

  ```sh
  sudo apt update -y
  sudo apt install redis-server
  ```

- Configure Redis:

  ```sh
  sudo $EDITOR /etc/redis/redis.conf

    # ...
    # supervised no
    supervised systemd
    # ...
    # requirepass foobared
    requirepass $PASSWORD
    # ...

  sudo systemctl restart redis.service
  ```

- Install application packages:

  ```sh
  cd api
  poetry install
  cd ../web
  npm install
  ```

- Setup environment variables for API application:

  ```sh
  cd api
  cp config/.env.example config/.env

  # Generate a SECRET_KEY for use below.
  python manage.py generate_secret_key

  # Edit config file, and put in valid values.
  $EDITOR config/.env
  ```

- Run database migrations:

  ```sh
  cd api
  . .venv/bin/activate
  python manage.py migrate
  ```

- Create Django superuser for access to the admin site:

  ```sh
  cd api
  . .venv/bin/activate
  python manage.py createsuperuser
  ```

## Running Development Processes

- Start the Django server (serves the API):

  ```sh
  cd api
  . .venv/bin/activate
  python manage.py runserver
  ```

- Start Celery (runs background jobs):

  ```sh
  cd api
  . .venv/bin/activate
  watchmedo auto-restart --directory=./ -p '*tasks*.py' -R -- celery -A config worker -l INFO
  ```

- Start the React server (serves the web app):

  ```sh
  cd web
  npm start
  ```
