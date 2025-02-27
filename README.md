# **Phoenix Growth Client Dashboard**  
**Phoenix Growth is a full-service web3 marketing agency, integrating seamlessly with clients across the blockchain ecosystem.  They specialize in developing and executing comprehensive marketing strategies, content creation, community management, social media management, experiential, and more.**  

The Client Dashboard is an AI-powered internal tool designed to track, analyze, and generate insights on client activity. It streamlines weekly reporting and provides data-driven recommendations, helping Phoenix Growth optimize marketing strategies and deliver measurable results.

---

## **Project Overview**  

The system is built using **Docker**, **FastAPI**, **PostgreSQL**, and **Next.js** to provide a scalable and flexible development environment.

### **Tech Stack**
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)  
- **Database**: PostgreSQL  
- **Frontend**: Next.js (React)  
- **Containerization**: Docker & Docker Compose  
- **API Documentation**: Swagger UI (`/docs` endpoint)  

#### **Upcoming Implementations:**  
- **Vector Database for RAG**: Implementing a vector database (e.g., ChromaDB, Weaviate, or Pinecone) to power Retrieval-Augmented Generation (RAG), enabling context-aware content retrieval.  
- **LLM Model(s) Integration**: Leveraging large language models (LLMs) to generate advanced analytics and insights.

---

## **Getting Started**  

Follow the steps below to set up and run the Client Dashboard on your local machine.

### **Prerequisites**  
Ensure you have the following installed:  
- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/)  
- [Node.js](https://nodejs.org/) (required for running the frontend)  
- [npm](https://www.npmjs.com/) (comes with Node.js, but ensure it's installed for managing frontend dependencies)  

---

## **Setup and Running Services**

### **1. Add Local API Hostname**  
Modify your hosts file to map `api` to `127.0.0.1`:
```bash
sudo vim /etc/hosts
127.0.0.1 api
```

### **2. Start All Services**  
Run all services (database, API, and client) with:
```bash
docker compose up
```

### **3. Start Only the Backend (Postgres & API)**  
If you only need the database and API running:
```bash
docker compose up postgres api
```

### **4. Running the Frontend Separately**  
If you prefer to run the frontend manually:
```bash
cd services/client
npm install
npm run dev
```

---

## **Accessing Services**
Once the services are running, you can access them at the following URLs:
- Client (Frontend UI): http://localhost:3000
- API (Backend Server): http://localhost:8000
- API Documentation (Swagger UI): http://localhost:8000/docs

---

## **Managing Containers**
To stop and remove all Client Dashboard containers, images, volumes, and the frontend build:

```bash
docker container rm -f $(docker container ls -qa --filter "label=project=phoenix"); docker image rm -f $(docker image ls -q --filter "label=project=phoenix"); docker volume rm $(docker volume ls -q --filter "label=project=phoenix"); rm -rf ./services/client/.next
```

---

## **Project Structure**
The repository is organized as follows:
```bash
client-dashboard/
│── services/
│   ├── api/           # FastAPI backend
│   ├── client/        # Next.js frontend
│── docker-compose.yml # Docker configuration
│── README.md          # Project documentation
```
