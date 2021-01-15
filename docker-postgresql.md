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

```jshell
\l - Display database
\c - Connect to database
\dn - List schemas
\dt - List tables inside public schemas
\dt schema1. - List tables inside particular schemas. For eg: 'schema1'.
```
