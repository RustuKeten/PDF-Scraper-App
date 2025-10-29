# PDF Scraper App

A production-ready Next.js application that allows users to upload and extract structured data from PDF files using OpenAI. Features authentication, database integration, and a credit-based subscription system.

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
- **OpenAI API** - PDF text extraction and data parsing
- **Stripe** - Payment processing (optional)
- **Docker** - Containerization

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth** - Authentication
- **Supabase** - Database and authentication
- **React Hot Toast** - Notifications
- **Docker** - Containerization

## Features

- 🔐 **Authentication** - NextAuth with Supabase
- 📄 **PDF Processing** - Text, image, and hybrid PDF support
- 🤖 **AI Extraction** - OpenAI-powered structured data extraction
- 💳 **Subscription System** - Stripe-based credit system (optional)
- 📊 **Dashboard** - File history and extracted data display
- 🚀 **Production Ready** - Vercel deployment ready

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Supabase account ([Sign up free](https://supabase.com))
- Stripe account (optional, for subscription feature)

> **Important**: Supabase is **required** for production deployment on Vercel. See `SUPABASE_SETUP.md` for detailed setup instructions.

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone <your-repo-url>
cd pdf-scraper-app
```

2. Set up environment variables:

```bash
# Create .env.local in frontend with your Supabase credentials
# See SUPABASE_SETUP.md for detailed instructions
# Edit the file with your API keys from Supabase
```

**Required Steps:**

1. Create Supabase account and project at https://supabase.com
2. Get your credentials (Project URL, anon key, service role key)
3. Copy the PostgreSQL connection string
4. Create `frontend/.env.local` with all credentials
5. See `SUPABASE_SETUP.md` for detailed setup guide

6. Run Docker Compose:

```bash
docker-compose up
```

This will start:

- PostgreSQL database on port 5433
- Backend API on port 3003
- Frontend on port 3002

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

## Environment Variables

### Frontend (.env.local)

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database URL (use Supabase PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3003

# Stripe (Optional)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# STRIPE_PRICE_BASIC=price_...
# STRIPE_PRICE_PRO=price_...
# STRIPE_PUBLIC_KEY=pk_test_...
```

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASS=postgres
DB_NAME=pdf_scraper_db
PORT=3003
OPENAI_API_KEY=your-openai-api-key
```

## API Endpoints

- `POST /api/upload` - Upload and process PDF files
- `GET /api/files` - Get user's file history
- `GET /api/files/:id` - Get specific file data
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Database Schema

- **Users** - User authentication and subscription data
- **Files** - Uploaded file metadata
- **ResumeData** - Extracted structured data
- **ResumeHistory** - Complete upload history

## Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Supabase (Database) - **REQUIRED**

> **Detailed setup instructions**: See `SUPABASE_SETUP.md`

1. Create a new Supabase project at https://supabase.com
2. Get your credentials (URL, anon key, service role key)
3. Set up DATABASE_URL with PostgreSQL connection string
4. Run `npx prisma db push` to create tables
5. Configure environment variables in Vercel

## Development Notes

- Frontend runs on port 3002 to avoid conflicts with other projects
- Backend runs on port 3003
- PostgreSQL runs on port 5433
- Large file uploads (>4MB) require special handling due to Vercel limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational and professional development purposes.
