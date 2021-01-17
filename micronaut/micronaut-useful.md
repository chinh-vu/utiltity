Quick note on application.yml configuration, the properties for configuration can be found in the 'Configuration Reference' link at the top of Micronaut documentation pages.

# Quick Documentation Links
- [IDE Setup](https://docs.micronaut.io/1.2.7/guide/index.html#ideSetup)
- [Http Server](https://docs.micronaut.io/1.2.7/guide/index.html#httpServer)
- [Http Client](https://docs.micronaut.io/1.2.7/guide/index.html#clientAnnotation)
- [Caching - General](https://docs.micronaut.io/1.2.7/guide/index.html#caching)
- [Caching - Redis 1.1.1](https://micronaut-projects.github.io/micronaut-redis/snapshot/guide/#cache)
- [Bean Validation](https://docs.micronaut.io/1.2.7/guide/index.html#beanValidation)
- [Bean Scopes](https://docs.micronaut.io/1.2.7/guide/index.html#scopes)
- [data](https://mflash.dev/blog/2020/04/05/querying-postgres-with-spring-data-and-micronaut-data/)

# Guides
- [First Micronaut App](https://guides.micronaut.io/1.x/micronaut-guides/creating-your-first-micronaut-app/guide/)
- [HTTP Server and Filter](https://guides.micronaut.io/1.x/micronaut-guides/micronaut-http-client/guide)
- [Micronaut Mastery parameter binding](https://dzone.com/articles/micronaut-mastery-binding-request-parameters-to-po)
```java
@Controller
public class MyController {
    @Get(value = "/bob/{name}/params")
    String getMyParam(String name, @QueryValue String surname) {
        return name + surname;
    }
}
```
- [Micronaut Server Tutorial](https://piotrminkowski.com/2019/04/23/micronaut-tutorial-server-application/)

# Reactive Programming
Micronaut's Netty server implementation allows for non-blocking data processing which frees up server threads to handle incoming requests and responses while letting other thread pools handle the processing, improving performance and resource utilization. The primary tool used in our code for reactive programming is Maybe which allows programming processing pipelines using .map, .defaultIfEmpty, .onErrorResumeNext, etc.

A good guide to start with is [Micronaut-Tutorial-Reactive](https://piotrminkowski.com/2019/11/12/micronaut-tutorial-reactive/)

Some examples of Maybe in use.

### Maybe.empty()
```java
public class HttpResponseHelper {
    public static <T> Maybe<MutableHttpResponse<T>> buildResponse(Maybe<T> data) {
        return data
                .map(body -> HttpResponse.ok(body))
                .defaultIfEmpty(HttpResponse.notFound());
    }
}
```
In the above example a generic '404 - Not Found' response is possible if the method invocator passes a Maybe.empty() when no data is found, otherwise a '200 - Ok' response is built with type erasure.

### JPA Sample
- [postgres](https://github.com/rmondejar/micronaut-postgres-example)
