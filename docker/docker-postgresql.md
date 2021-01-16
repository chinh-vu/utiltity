## postgresql DB
- Create [Dockerfile](https://wkrzywiec.medium.com/database-in-a-docker-container-how-to-start-and-whats-it-about-5e3ceea77e50)
```
FROM postgres 
ENV POSTGRES_PASSWORD postgres 
ENV POSTGRES_DB testdb 
COPY schema.sql /docker-entrypoint-initdb.d/
```
- Create schema.sql file
```
CREATE TABLE public.persons (
    id int PRIMARY KEY,
    firstName varchar(255),
    lastName varchar(255)
);
```
- [Create docker-compose.yml](https://onexlab-io.medium.com/docker-compose-postgres-initdb-ba0021deef76)
```
version: '3.6'
services: 
    postgres:
        image: postgres
        restart: always
        environment: 
            - DATABASE_HOST=127.0.0.1
            - POSTGRES_USER=root
            - POSTGRES_PASSWORD=root
            - POSTGRES_DB=root  

        ports: 
            - "5432:5432"
        volumes: 
            - ./docker_postgres_init.sql:/docker-entrypoint-initdb.d/docker_postgres_init.sql
    
    pgadmin-compose:
        image: dpage/pgadmin4
        environment: 
            PGADMIN_DEFAULT_EMAIL: "test@gmail.com"
            PGADMIN_DEFAULT_PASSWORD: "test123!"
        ports: 
            - "16543:80"
        depends_on: 
            - postgres    
```
- Create docker_postgres_init.sql
```
CREATE TABLE student
(
    id bigint NOT NULL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT student_pkey PRIMARY KEY (id)
);

INSERT INTO student(id, name) VALUES
 (1, 'A'),
 (2, 'B'),
 (3, 'C');
```

## Postgres few useful cmd @psql console
```jshell
\l - Display database
\c - Connect to database
\dn - List schemas
\dt - List tables inside public schemas
\dt schema1. - List tables inside particular schemas. For eg: 'schema1'.
```
