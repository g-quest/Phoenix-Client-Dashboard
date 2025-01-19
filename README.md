# Phoenix Client Insights Dashboard

## Setup

### Add to Hosts File

Add the following entry to your `/etc/hosts` file:

```bash
sudo vim /etc/hosts
  127.0.0.1 api
```

## Running Services

### Run All Services

To start all services, run:

```bash
docker compose up
```

### Run API and Postgres Only

To start only the API and Postgres containers, run:

```bash
docker compose up api postgres
```

### Run Client Separately

To run the client separately:

```bash
cd services/client
npm install # If not done already
npm run dev
```

## Accessing Services

- Client: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Cleanup

To remove all containers, images, volumes, and client build:

```bash
docker container rm -f $(docker container ls -qa --filter "label=project=phoenix") \
&& docker image rm -f $(docker image ls -q --filter "label=project=phoenix") \
&& (docker volume ls -q --filter "label=project=phoenix" | xargs -r docker volume rm) \
&& rm -rf ./services/client/.next
```
