# Docker Deployment Guide

## Quick Start

### Option 1: Build and Run with Docker Compose (Recommended)

```bash
# Navigate to backend directory
cd backend

# Build and start the container
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Option 2: Build and Run with Docker Commands

```bash
# Navigate to backend directory
cd backend

# Build the Docker image
docker build -t hotel-bidding-backend:latest .

# Run the container
docker run -d \
  --name hotel-bidding-backend \
  -p 8081:8081 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/logs:/app/logs \
  hotel-bidding-backend:latest

# View logs
docker logs -f hotel-bidding-backend

# Stop the container
docker stop hotel-bidding-backend

# Remove the container
docker rm hotel-bidding-backend
```

## Configuration

### Using Environment Variables

The application.properties file is embedded in the Docker image. To override values:

#### Method 1: Using .env file (with docker-compose)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your configuration

3. Run with docker-compose:
   ```bash
   docker-compose up --build
   ```

#### Method 2: Using -e flag (with docker run)

```bash
docker run -d \
  --name hotel-bidding-backend \
  -p 8081:8081 \
  -e SPRING_DATA_MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  -e PAYHERE_MERCHANT_ID="your-merchant-id" \
  hotel-bidding-backend:latest
```

#### Method 3: Using env_file (with docker run)

```bash
docker run -d \
  --name hotel-bidding-backend \
  -p 8081:8081 \
  --env-file .env \
  hotel-bidding-backend:latest
```

## Production Deployment

### 1. Build the JAR file first (optional - Dockerfile does this)

```bash
mvn clean package -DskipTests
```

### 2. Build Docker image

```bash
docker build -t hotel-bidding-backend:1.0.0 .
```

### 3. Tag for registry (if pushing to Docker Hub or AWS ECR)

```bash
# Docker Hub
docker tag hotel-bidding-backend:1.0.0 yourusername/hotel-bidding-backend:1.0.0
docker push yourusername/hotel-bidding-backend:1.0.0

# AWS ECR
docker tag hotel-bidding-backend:1.0.0 123456789.dkr.ecr.us-east-1.amazonaws.com/hotel-bidding-backend:1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/hotel-bidding-backend:1.0.0
```

### 4. Run in production

```bash
docker run -d \
  --name hotel-bidding-backend \
  -p 8081:8081 \
  --restart unless-stopped \
  --env-file .env.production \
  -v /var/app/uploads:/app/uploads \
  -v /var/app/logs:/app/logs \
  hotel-bidding-backend:1.0.0
```

## Docker Commands Reference

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop hotel-bidding-backend

# Start container
docker start hotel-bidding-backend

# Restart container
docker restart hotel-bidding-backend

# Remove container
docker rm hotel-bidding-backend

# Remove container forcefully
docker rm -f hotel-bidding-backend
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi hotel-bidding-backend:latest

# Remove unused images
docker image prune

# Remove all unused images
docker image prune -a
```

### Logs and Debugging

```bash
# View logs
docker logs hotel-bidding-backend

# Follow logs (real-time)
docker logs -f hotel-bidding-backend

# View last 100 lines
docker logs --tail 100 hotel-bidding-backend

# Execute commands inside container
docker exec -it hotel-bidding-backend sh

# Check container health
docker inspect hotel-bidding-backend | grep -i health
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect backend_uploads

# Remove volume
docker volume rm backend_uploads

# Remove unused volumes
docker volume prune
```

## Health Check

The container includes a health check endpoint. To verify:

```bash
# Check health status
docker inspect hotel-bidding-backend --format='{{.State.Health.Status}}'

# Access health endpoint
curl http://localhost:8081/api/v1/auth/health
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs hotel-bidding-backend

# Check if port is already in use
netstat -ano | findstr :8081  # Windows
lsof -i :8081                 # Linux/Mac
```

### Out of memory errors

Adjust JVM memory settings in docker-compose.yml:

```yaml
environment:
  - JAVA_OPTS=-Xmx1024m -Xms512m
```

### Database connection issues

1. Verify MongoDB URI in environment variables
2. Check network connectivity
3. Ensure MongoDB IP is whitelisted (for cloud databases)

### Permission issues with volumes

```bash
# Change ownership (Linux/Mac)
sudo chown -R 1000:1000 uploads logs

# Or run container as root (not recommended)
docker run --user root ...
```

## Multi-stage Build Benefits

The Dockerfile uses a multi-stage build which:

1. **Reduces image size**: Final image only contains JRE and JAR (~200MB vs ~500MB)
2. **Improves security**: No build tools in production image
3. **Faster deployments**: Smaller images download faster
4. **Cache optimization**: Maven dependencies are cached separately

## Security Considerations

1. **Non-root user**: Container runs as `spring` user, not root
2. **Health checks**: Automatic health monitoring
3. **Environment variables**: Sensitive data not hardcoded
4. **Network isolation**: Uses Docker networks
5. **Resource limits**: Set memory and CPU limits in production

## Performance Tuning

### JVM Memory Settings

```yaml
environment:
  - JAVA_OPTS=-Xmx1024m -Xms512m -XX:MaxRAMPercentage=75.0
```

### Database Connection Pool

Add to application.properties or environment:

```properties
spring.data.mongodb.max-pool-size=50
spring.data.mongodb.min-pool-size=10
```

## Monitoring

### Container Stats

```bash
# Real-time stats
docker stats hotel-bidding-backend

# Memory usage
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}"
```

### Application Logs

```bash
# Follow application logs
docker logs -f hotel-bidding-backend

# Save logs to file
docker logs hotel-bidding-backend > backend.log 2>&1
```

## Backup and Restore

### Backup Uploads

```bash
# Create backup
docker run --rm \
  --volumes-from hotel-bidding-backend \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup.tar.gz /app/uploads

# Restore backup
docker run --rm \
  --volumes-from hotel-bidding-backend \
  -v $(pwd):/backup \
  alpine tar xzf /backup/uploads-backup.tar.gz -C /
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build Docker image
  run: docker build -t hotel-bidding-backend:${{ github.sha }} .

- name: Push to registry
  run: |
    echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
    docker push hotel-bidding-backend:${{ github.sha }}
```

## Support

For issues or questions:
- Check logs: `docker logs hotel-bidding-backend`
- Inspect container: `docker inspect hotel-bidding-backend`
- Review application.properties for configuration issues
