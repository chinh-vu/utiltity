# [Docker Site](https://docs.docker.com/get-started/overview/)
https://docs.docker.com/get-started/overview/

# UHG Docker Repo
- docker.repo1.uhc.com

# Login
```
docker login <repo>
docker login docker.repo1.uhc.com

```

# Commands
```
docker run -it -v /var/run/docker.sock:/var/run/docker.sock ubuntu:latest
## run docker container and install docker CLI in docker container
docker run -it -v /var/run/docker.sock:/var/run/docker.sock ubuntu:latest sh -c "apt-get update ; apt-get install docker.io -y ; bash"
docker ps
       images
       image rm <image>

## inspect docker privileged
docker inspect --format='{{.HostConfig.Privileged}}' [container_id]       
```
# pulling and run latest ubuntu and Docker CLI installation on docker container
- [Q & A](https://unix.stackexchange.com/questions/363048/unable-to-locate-package-docker-ce-on-a-64bit-ubuntu)
- [Another site](https://innuendo.readthedocs.io/en/latest/docker-compose/docker-compose.html)
```
## must run with --privileged option otherwise, docker won't start as service
docker run  --privileged  -it ubuntu bash
apt-get update
## key input interaction - Y and enter

apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common    
## key input interaction - geographic [2] timezone [37]

curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -   
apt-key fingerprint 0EBFCD88
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal test"

apt-get install docker-ce docker-ce-cli
##  key input interaction - [Y] and enter

service docker start

docker manifest inspect [IMAGE NAME]

## docker diff required container
docker diff [CONTAINER]
```

# Misc unix command
```
## ubuntu version
lsb_release -a

## start docker daemon
service docker start
```
