# Quick Start Guide

Get the Theatre Discovery App running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- Ticketmaster API key (free): https://developer.ticketmaster.com/
- Anthropic API key: https://console.anthropic.com/

## Steps

### 1. Configure Environment

Edit `.env` file and set these required values:

```bash
APP_PASSWORD=mypassword123
JWT_SECRET=my-random-secret-key-at-least-32-characters-long
POSTGRES_PASSWORD=postgres123
REDIS_PASSWORD=redis123
TICKETMASTER_API_KEY=your-ticketmaster-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

### 2. Start the App

```bash
cd theatre-app
docker-compose up -d
```

Wait 30 seconds for all services to start.

### 3. Access the App

Open http://localhost:8080

Login with the password you set (`APP_PASSWORD`)

### 4. Start Using

1. **Build Taste Profile**: Add your favorite artists, shows, festivals
2. **Discover Events**: Search for shows in any city
3. **Plan Trips**: Create trips and get show recommendations
4. **Generate Itineraries**: AI-powered trip planning

## Troubleshooting

**App won't start?**
```bash
docker-compose logs
```

**Need to reset?**
```bash
docker-compose down -v
docker-compose up -d
```

**Check health:**
```bash
curl http://localhost:3000/health
```

## What's Running?

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Next Steps

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.
