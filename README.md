# Theatre Discovery App - Full Stack

A cost-effective theatre discovery and trip planning application with Ticketmaster API integration and Claude Haiku AI matching.

## Features

- **Taste Profile Management**: Build your theatre preferences
- **Event Discovery**: Find shows using Ticketmaster API + AI matching
- **Trip Planning**: Plan trips and get show recommendations
- **Itinerary Generation**: AI-powered trip itineraries with flights and hotels
- **Cost Efficient**: 95%+ cost reduction vs web scraping approach

## Architecture

- **Frontend**: React (Vite) on port 8080
- **Backend**: Node.js/Express on port 3000
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **APIs**: Ticketmaster Discovery API, Claude Haiku

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Ticketmaster API key (free tier: https://developer.ticketmaster.com/)
- Anthropic API key (https://console.anthropic.com/)

### Setup

1. **Clone and navigate to the project**:
   ```bash
   cd theatre-app
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and passwords
   ```

3. **Start the application**:
   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

### Database Migrations

Database migrations run automatically on first startup. To manually run migrations:

```bash
docker-compose exec postgres psql -U theatre_user -d theatre_db -f /docker-entrypoint-initdb.d/001_create_profile.sql
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with password

### Profile
- `GET /api/v1/profile` - Get taste profile
- `PUT /api/v1/profile` - Update taste profile

### Events
- `GET /api/v1/events/discover` - Discover events matching profile

### Trips
- `GET /api/v1/trips` - List all trips
- `POST /api/v1/trips` - Create trip
- `GET /api/v1/trips/:id/recommendations` - Get show recommendations
- `DELETE /api/v1/trips/:id` - Delete trip

### Itineraries
- `POST /api/v1/itineraries/generate` - Generate itinerary
- `GET /api/v1/itineraries` - List itineraries

## Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Cost Analysis

- **Ticketmaster API**: Free tier (5 req/sec, 5000/day)
- **Claude Haiku**: ~$0.03 per session
- **Total**: ~$0.03 per user session vs $1-5 previously

## License

MIT
