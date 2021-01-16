# utiltity - knowlege share
- [Postgresql Dockerfile](docker-postgresql.md)


# Gradle -
## set gradle version
```
./gradlew wrapper --gradle-version=6.3 --distribution-type=bin
```

## Compile with JDK Version
```
./gradlew build -x test -Dorg.gradle.java.home=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
```

