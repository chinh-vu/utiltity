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

## NodeJS ENV
- [NODE-ENV](https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7)
- [article](https://codeburst.io/node-js-best-practices-smarter-ways-to-manage-config-files-and-variables-893eef56cbef)
- sample code
```jscript
{
    "development": {
        "config_id": "sand box",
        "app_name": "my app",
        "app_desc": "my app descrip",
        "node_port": 3000,
        "database": "db-dev
    },
    "testing": {
        "config_id": "testing",
        "database": "db-test"
    },
    "staging": {
        "config_id": "staging",
        "node_port": 8080,
        "database": "db-stag"
    },
    "production": {
        "config_id": "production",
        "node_port": 80,
        "database": "db-prod"
    }
}

const _ = require('lodash');
//===========================================================
// module variables
const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);
view raw
```
- [article on sinon](https://www.sitepoint.com/sinon-tutorial-javascript-testing-mocks-spies-stubs/)

- [geo location](https://ip-api.com/docs/api:json)
- https://ipwhois.app/json/76.113.144.1

- [react & express](https://rapidapi.com/blog/create-react-app-express/)
