## Reference
- [sample code](https://github.com/AlaaMezian/NodeJs-backend-structure)

## Prerequisite
### PostgreSQL DB
- [code reference](https://hub.docker.com/_/postgres)
- [tips](https://hashinteractive.com/blog/docker-compose-up-with-postgres-quick-tips/)

```jshell
# simple docker command
docker run --name pg-docker --rm -p 5400:5432 -e POSTGRES_PASSWORD=docker -e POSTGRES_USER=docker -d postgres
```



## docker-compose
- create schema.sql
```
# Only enable this for new deployment
# DROP DATABASE IF EXISTS topfive;

CREATE DATABASE topfive;

-- Make sure we're using our `blog` database
\c topfive;

-- We can create our user table
CREATE TABLE IF NOT EXISTS user (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  email VARCHAR
);

-- We can create our post table
CREATE TABLE IF NOT EXISTS rank(
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES user(id),
  title VARCHAR,
  content TEXT,
  date DATE DEFAULT CURRENT_DATE
  rank INTEGER
);

```

- create docker-compose.yml
```
version: '3'

services:
  postgresql:
    image: postgres
    container_name: pg-docker
    ports:
      - "5400:5432"
    environment:
      - pg.env
    volumes:
      - ./postgres.conf:/etc/postgresql/postgresql.conf
      - ./data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    restart: always    
```
- create pg.env
``` 
# .env
POSTGRES_USER=topfive
POSTGRES_PASSWORD=topfive
POSTGRES_DB=topfive
```
- run
```
docker-compose up
# or 
docker-compose run database bash # drop into the container shell

# username/password defined in the database.env
psql --host=database --username=topfive --dbname=topfive
```

