# Phoenix

#### Add the following to your hosts file:

```bash
sudo vim /etc/hosts
  127.0.0.1 api
```

#### Run all services:

```bash
docker compose up
```

#### To start just the API and Chroma containers:

```bash
docker compose up api chroma
```

#### Additionally, if you want to run the client separately:

```bash
cd services/client
npm install
npm run dev
```

#### Services should be accessable here

Client: http://localhost:3000
API: http://localhost:8000
API Docs: http://localhost:8000/docs

#### To remove all containers, images, volumes, and client build when necessary:

```bash
docker container rm -f $(docker container ls -qa --filter "label=project=phoenix") \
&& docker image rm -f $(docker image ls -q --filter "label=project=phoenix") \
&& (docker volume ls -q --filter "label=project=phoenix" | xargs -r docker volume rm) \
&& rm -rf ./services/client/.next
```
