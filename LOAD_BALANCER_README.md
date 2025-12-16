# Load Balancer Setup

This project now includes a Docker Compose setup with an Nginx Load Balancer.

## Architecture

- **Nginx Load Balancer**: Entry point (Port 8888). Routes traffic to Frontend and Backend.
- **Frontend**: Nginx container serving the React application.
- **Backend**: Node.js application scaled to 3 replicas for load balancing.
- **MongoDB**: Database service.

## Prerequisites

- Docker
- Docker Compose

## How to Run

1.  Build and start the services:
    ```bash
    docker-compose up --build
    ```

2.  Access the application:
    - Frontend: [http://localhost:8888](http://localhost:8888)
    - Backend API: [http://localhost:8888/api](http://localhost:8888/api)

## Configuration

- **Scaling**: You can change the number of backend replicas in `docker-compose.yml` under the `backend` service `deploy.replicas` section.
- **Environment Variables**: Backend environment variables are defined in `docker-compose.yml`.

## Files Added

- `docker-compose.yml`: Orchestration file.
- `nginx/nginx.conf`: Main Load Balancer configuration.
- `backend/Dockerfile`: Backend container definition.
- `frontend/Dockerfile`: Frontend container definition.
- `frontend/nginx.conf`: Frontend web server configuration.
