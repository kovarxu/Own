## Docker入门

### 概念

* image 镜像
* container 容器，镜像的实例

### run

启动一个容器运行镜像

`docker run -d -p 80:80 docker/someservice` 运行最后名字的服务
`docker run -dp 3001:3001 -w /usr/local/app blog-server npm run dev` 运行node程序

* -d 后台运行(detached)
* -p 端口号映射
* -w 指定工作目录
* -i 交互方式运行（非后台）
* --name 给容器命名

### exec

用于在容器中执行某些命令

`docker exec -it <container-id> <command>` 比如对一个启动的mongo容器，运行`docker exec -it 8c26c40cc3e9 mongo` 进行连接

* -d 后台运行
* -i 交互方式运行
* -t 启动一个虚拟终端(tty)
* -e 指定环境变量，如：`-e USERNAME=kovarxu \ -e PASSWORD=123456`
* -w 指定工作目录

### 查看日志

`docker logs -f <id>` 查看某个进程的logs，加上 -f 可以持续监听日志

`docker exec -it <container-id> bash` 也可以用

### 停止服务

1. `docker ps` 找到container实例的id
2. `docker stop <id>` 停止container
3. `docker rm <id>` 删除container; rmi可以删除镜像

### 查找镜像

`docker search <some-program>` 查找

镜像名称如`node:12-alpine` 后面部分是它的tag，基于alpine开发的（一个微型的linux，提供基础功能）

### DOCKERFILE

该文件用来描述一个镜像，运行它可以得到一个镜像

* FROM 源镜像地址
* WORKDIR 工作目录
* COPY 复制目录
* RUN 运行一些命令
* CMD 启动某些程序
* ENV 环境变量
* EXPOSE 暴露的端口号

如：

```
FROM node:12-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

创建镜像：`docker build -t myimage .` 最后一个点号表示在当前目录寻找 DOCKERFILE

### 远程

`docker push <username>/<imagename>` 推到远程 dockerhub

[Play With Docker](http://play-with-docker.com/) 站点可以直接访问并使用 dockerhub镜像

### 卷

创建卷可以将本地文件映射到docker进程

`docker volume create <volume-name>` 创建卷

`docker run -dp 27107:27107 -v <volume-name>:<root-in-docker-program> mongo` 链接卷

`docker volume inspect <volume-name>` 查看卷

也可以更方便地进行直接链接

`docker run -dp 3000:3000 -w "$(pwd):/app" node:12-alpine sh -c "yarn install && yarn run dev"` 

### 网络

网络用于连接多个不同的容器

1. 创建网络 `docker network create my-network`

2. 创建mongodb容器，使用创建的网络

```s
docker run -dp 27017:27017 \
  --network mongo-net  --network-alias mynet \
  -v ~/Documents/db/mongo:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=kovarxu \
  -e MONGO_INITDB_ROOT_PASSWORD=db123456789 \
  mongo
```

3. 使用mongodb创建的服务, 注意第六行指定了网络名称

```s
docker run -dp 3001:3001 --name backend-service --network mongo-net \
  -w /app \
  -v "$(pwd):/app" \
  -e MONGO_USR=kovarxu \
  -e MONGO_PWD=db123456789 \
  -e MONGO_HOST=mynet \
  -e MONGO_DB=myblog \
  node:12-alpine \
  sh -c "npm install && npm run dev"
```

### Docker-Compose

上面的东西太复杂了，创建多节点任务很容易搞错，所以有了Docker-Compose

创建文件 `docker-compose.yml`

```yml
version: "3.7"

services:
  app:
    image: node:12-alpine
    command: sh -c "npm install && npm run dev"
    ports:
      - 3001:3001
    volumes:
      - "$(pwd):/app"
    environment:
      MONGO_USR: kovarxu
      MONGO_PWD: db123456789
      MONGO_HOST: mon
      MONGO_DB: myblog
    working_dir: /app
  
  mon:
    image: mongo
    ports:
      - 27017:27017
    volumes:
      - ~/Documents/db/mongo:/data/db
    enviroment:
      MONGO_INITDB_ROOT_USERNAME:kovarxu
      MONGO_INITDB_ROOT_PASSWORD:db123456789
```

docker不能保证服务启动的先后顺序，需要程序里自行判断
