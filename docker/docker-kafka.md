# Kafka Docker-Compose
The provided scripts will do the following
* **run.sh** - Create/Start zookeeper (port 2181) and agent (port 9092) Docker containers
* **stop.sh** - Stop running zookeeper/agent containers created by start.sh, kafka data will persist and containers can be started with start.sh
* **remove.sh** - Stop running zookeeper/agent containers and remove them from Docker. **THIS WILL DELETE KAFKA DATA**


## docker-compose.yml
```
version: '3.7'

networks:
  kafka:
    driver: bridge

services:
  zookeeper:
    image: docker.repo1.uhc.com/wurstmeister/zookeeper:latest
    ports:
      - "2181:2181"
    networks:
      - kafka

  kafka:
    image: docker.repo1.uhc.com/wurstmeister/kafka:2.12-2.5.0
    links:
      - zookeeper
    networks:
      - kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: localhost
      KAFKA_ADVERTISED_PORT: 9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

- run.sh
```
#!/bin/bash
docker-compose -f kafka-docker-compose.yml up -d
```

- stop.sh
```
#!/bin/bash

echo $(docker container stop kafka-docker_kafka_1)
echo $(docker container stop kafka-docker_zookeeper_1)
```

- remove.sh
```
#!/bin/bash

./stop.sh

docker container rm kafka-docker_zookeeper_1 kafka-docker_kafka_1
```
