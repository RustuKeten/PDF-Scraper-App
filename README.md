# 100 Days Deep Dive Coding

A full-stack application with NestJS backend and Next.js frontend, containerized with Docker.

## Project Structure

```
├── backend/          # NestJS API server
├── frontend/         # Next.js React application
└── docker-compose.yml # Docker orchestration
```

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Database
- **Docker** - Containerization

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Docker** - Containerization

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <your-repo-url>
cd 100daysdeepdivecoding
```

2. Navigate to the backend directory and run Docker Compose:
```bash
cd backend
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3001
- Frontend on port 3000

### Local Development

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /` - Hello World endpoint

## Database

- **Host**: localhost (or `postgres` in Docker)
- **Port**: 5432
- **Database**: mydb
- **Username**: postgres
- **Password**: postgres

## Development Notes

- Backend uses `--legacy-peer-deps` for npm install due to dependency conflicts
- Frontend runs without Turbopack in Docker to avoid filesystem issues
- CORS may need to be configured for frontend-backend communication

## Next Steps

- [ ] Set up frontend-backend communication
- [ ] Add authentication
- [ ] Implement CRUD operations
- [ ] Add proper error handling
- [ ] Set up testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes as part of the 100 Days Deep Dive Coding challenge.
