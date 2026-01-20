# Theatre Discovery App - Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Docker and Docker Compose** installed
2. **Ticketmaster API Key** (free tier)
   - Sign up at: https://developer.ticketmaster.com/
   - Create an app to get your API key
3. **Anthropic API Key**
   - Sign up at: https://console.anthropic.com/
   - Get your API key from the dashboard

## Step 1: Configure Environment Variables

1. Open the `.env` file in the root directory
2. Update the following values:

```bash
# Set a strong password for the app
APP_PASSWORD=your-secure-password

# Set a random 32+ character string for JWT secret
JWT_SECRET=your-random-jwt-secret-min-32-chars

# Set secure passwords for database and redis
POSTGRES_PASSWORD=your-secure-db-password
REDIS_PASSWORD=your-secure-redis-password

# Add your API keys
TICKETMASTER_API_KEY=your-actual-ticketmaster-key
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key
```

## Step 2: Start the Application

From the `theatre-app` directory, run:

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database
- Start Redis cache
- Build and start the backend API
- Build and start the frontend

## Step 3: Verify the Deployment

1. **Check services are running**:
   ```bash
   docker-compose ps
   ```

2. **Check backend health**:
   ```bash
   curl http://localhost:3000/health
   ```

   Should return:
   ```json
   {
     "success": true,
     "message": "Server is healthy",
     "services": {
       "database": "connected",
       "redis": "connected"
     }
   }
   ```

3. **Access the frontend**:
   - Open http://localhost:8080 in your browser
   - Login with the password you set in `.env` (`APP_PASSWORD`)

## Step 4: Test the Application

1. **Build your taste profile**:
   - Go to "Taste Profile" tab
   - Add your favorite artists, shows, and festivals
   - Click "Save Profile"

2. **Discover events**:
   - Go to "Discover Events" tab
   - Enter a city (e.g., "London", "New York")
   - Optionally add country code (e.g., "GB", "US")
   - Set date range
   - Click "Discover Events"

3. **Create trips**:
   - Go to "My Trips" tab
   - Click "New Trip"
   - Fill in destination and dates
   - Click "Create Trip"

## Troubleshooting

### Backend won't start

Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Missing API keys in `.env`
- Database connection issues
- Port 3000 already in use

### Frontend won't build

Check logs:
```bash
docker-compose logs frontend
```

Common issues:
- Port 8080 already in use
- Build errors (check Node.js version in Dockerfile)

### Database initialization fails

```bash
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Redis connection issues

Check Redis logs:
```bash
docker-compose logs redis
```

Ensure `REDIS_PASSWORD` is set correctly in `.env`

## Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

## Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U theatre_user theatre_db > backup.sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U theatre_user theatre_db
```

## Production Deployment

For production deployment on Proxmox or other servers:

1. **Update `.env` for production**:
   ```bash
   NODE_ENV=production
   REACT_APP_API_URL=http://your-server-ip:3000/api/v1
   ```

2. **Use a reverse proxy (nginx/traefik)** for HTTPS

3. **Set up proper firewall rules**

4. **Use strong passwords** for all services

5. **Regular backups** of PostgreSQL database

6. **Monitor costs** in Anthropic console

## Expected Costs

- **Ticketmaster API**: Free (5000 requests/day)
- **Claude Haiku API**: ~$0.03 per user session
- **Infrastructure**: Free with Docker on existing server

## API Rate Limits

- Ticketmaster: 5 requests/second, 5000/day
- The app includes built-in rate limiting
- Redis caching reduces API calls significantly

## Support

For issues:
1. Check logs with `docker-compose logs`
2. Verify all environment variables are set
3. Ensure API keys are valid
4. Check Ticketmaster and Anthropic API dashboards for errors
