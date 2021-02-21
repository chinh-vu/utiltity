# utiltity - knowlege share
- [Postgresql Dockerfile](docker/docker-postgresql.md)
- [nodejs pg multiple rows](https://www.wlaurance.com/2018/09/node-postgres-insert-multiple-rows)
- clean up and install node stable version
```
sudo npm cache clean -f (force) clear you npm cache
sudo npm install -g n install n (this might take a while)
sudo n stable upgrade to the current stable version
```

# Gradle -
## set gradle version
```
./gradlew wrapper --gradle-version=6.3 --distribution-type=bin
```

## Compile with JDK Version
```
./gradlew build -x test -Dorg.gradle.java.home=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
```

## Swagger Node 
- [article](https://www.codementor.io/@peteradeoye/splitting-your-swagger-spec-into-multiple-files-in-a-node-project-nuprc0mej)

## Nodejs ES6
- [tutorial](https://www.freecodecamp.org/news/how-to-enable-es6-and-beyond-syntax-with-node-and-express-68d3e11fe1ab/)
