# Docker Setup for FastAPI Application

This document provides instructions for running the FastAPI application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URL=mongodb://mongodb:27017/
DATABASE_NAME=ecohire

# For production with MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
# DATABASE_NAME=ecohire

# Google AI Configuration (if using AI services)
# GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# JWT Configuration (if using authentication)
# JWT_SECRET_KEY=your_jwt_secret_key_here
# JWT_ALGORITHM=HS256
# JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Configuration
# DEBUG=True
# LOG_LEVEL=INFO
```

## Running with Docker Compose

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f app
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

4. **Rebuild and restart:**
   ```bash
   docker-compose up --build -d
   ```

## Running with Docker only

1. **Build the image:**
   ```bash
   docker build -t fastapi-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8000:8000 --env-file .env fastapi-app
   ```

## Services

- **FastAPI App**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **MongoDB**: localhost:27017
- **Mongo Express**: http://localhost:8081 (admin/admin)

## Development

For development with hot reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Production Considerations

1. Use environment-specific `.env` files
2. Set up proper secrets management
3. Use a reverse proxy (nginx) for production
4. Enable SSL/TLS certificates
5. Set up monitoring and logging
6. Use a managed MongoDB service (MongoDB Atlas) for production
