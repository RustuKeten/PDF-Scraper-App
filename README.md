# PDF Scraper App

A production-ready Next.js application that allows users to upload and extract structured data from PDF files using OpenAI. Features authentication, database integration, and a credit-based subscription system.

## Project Structure

```
├── frontend/         # Next.js application (frontend + API routes)
│   ├── src/
│   │   ├── app/      # Next.js App Router (pages + API routes)
│   │   ├── components/
│   │   ├── lib/      # Utilities (Prisma, auth)
│   │   └── types/    # TypeScript types
│   └── prisma/       # Prisma schema and migrations
```

## Tech Stack

- **Next.js 15** - React framework with App Router and API routes
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth** - Authentication
- **Supabase** - PostgreSQL database (free tier)
- **Prisma** - Database ORM
- **OpenAI API** - PDF text extraction and structured data parsing
- **pdf-parse** - PDF text extraction
- **React Hot Toast** - User notifications
- **Stripe** - Payment processing (optional, for subscription feature)

## Features

- 🔐 **Authentication** - NextAuth with credentials provider
- 📄 **PDF Processing** - Text-based PDF support with OpenAI
- 🤖 **AI Extraction** - OpenAI-powered structured resume data extraction
- 💳 **Credit System** - Credit-based operations (100 credits per extraction)
- 📊 **Dashboard** - File history and extracted data display
- 📝 **History Tracking** - Complete upload history with ResumeHistory table
- 🚀 **Vercel Ready** - Optimized for serverless deployment

## Prerequisites

- Node.js 18+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Supabase account ([Sign up free](https://supabase.com))
- Stripe account (optional, for subscription feature)

> **Important**: Supabase is **required** for production deployment on Vercel.

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd PDF_Scraper_App
```

### 2. Set Up Supabase

1. Create a Supabase account and project at <https://supabase.com>
2. Get your credentials:
   - Project URL
   - Anon key
   - Service role key
   - PostgreSQL connection string (DATABASE_URL)

### 3. Configure Environment Variables

Create `frontend/.env.local` with your credentials:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-nextauth-secret-key-here-min-32-chars

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database URL (use Supabase PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# OpenAI API (REQUIRED)
OPENAI_API_KEY=your-openai-api-key

# Stripe (Optional - for subscription feature)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# STRIPE_PRICE_BASIC=price_...
# STRIPE_PRICE_PRO=price_...
# STRIPE_PUBLIC_KEY=pk_test_...
```

### 4. Install Dependencies and Set Up Database

```bash
cd frontend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

## Architecture

This application uses a **Next.js-only architecture** with serverless API routes:

- **Frontend**: Next.js App Router with React components
- **API Routes**: Next.js API routes (`/app/api/*`) handle all backend logic
- **Database**: Supabase PostgreSQL accessed via Prisma
- **Processing**: All PDF extraction and OpenAI processing happens in Vercel serverless functions

### Why Next.js-Only?

- ✅ Matches assignment requirements (Vercel deployment)
- ✅ No separate backend needed
- ✅ Serverless functions auto-scale
- ✅ Simplified deployment (one codebase)
- ✅ Cost-effective (Vercel free tier)

## API Endpoints

All endpoints are Next.js API routes located in `frontend/src/app/api/`:

- `POST /api/files/upload` - Upload and process PDF files
- `GET /api/files` - Get user's file history
- `GET /api/files/[id]` - Get specific file and extracted data
- `GET /api/files/credits` - Get user credit balance
- `POST /api/webhooks/stripe` - Stripe webhook handler (optional)

## Database Schema

Managed by Prisma and Supabase:

- **users** - User authentication, credits, and subscription data
- **files** - Uploaded file metadata (fileName, fileSize, status)
- **resume_data** - Extracted structured JSON data
- **resume_history** - Complete upload history tracking

Run `npx prisma studio` to view and manage your database.

## Large File Handling

Vercel serverless functions have a **4.5MB payload limit**. This application handles this as follows:

### Current Implementation (Files ≤ 4MB)

- Files are uploaded directly through the API route
- Processing happens synchronously in the serverless function
- Works for most standard PDF files

### Files > 4MB (Not Supported in Current Version)

For production use with larger files, you would need to implement:

1. **Direct Client Upload to Supabase Storage**:

   - Upload files directly from the browser to Supabase Storage
   - Trigger processing via webhook or background job
   - Store file URL in database

2. **Alternative Approaches**:
   - Use Vercel Edge Functions with streaming
   - Implement chunked uploads
   - Use external file storage (AWS S3, Cloudflare R2)

Currently, files larger than 4MB will return an error message explaining the limitation.

## Deployment

### Vercel Deployment

1. **Connect Repository**:

   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure Environment Variables**:

   - Add all variables from `.env.local` to Vercel dashboard
   - Ensure `OPENAI_API_KEY` and Supabase credentials are set

3. **Deploy**:

   - Vercel will auto-deploy on push to main branch
   - Your app will be live at `your-app.vercel.app`

4. **Update NEXTAUTH_URL**:
   - Set `NEXTAUTH_URL=https://your-app.vercel.app` in Vercel environment variables

### Database Setup (Supabase)

1. Create tables in Supabase:

   ```bash
   cd frontend
   npx prisma db push
   ```

2. Or run SQL migrations manually (see `prisma/create-tables.sql`)

## Development Notes

- **Port**: Frontend runs on port 3002
- **File Size Limit**: 10MB maximum (4MB for Vercel serverless)
- **Credit System**: 100 credits per PDF extraction
- **Processing**: Synchronous processing in API route (may timeout for very large PDFs)

## Optional: Stripe Integration

See the assignment requirements for implementing Stripe subscription and credit management:

- Two plans: Basic (10,000 credits, $10) and Pro (20,000 credits, $20)
- Credit deduction: 100 credits per extraction
- Webhook handling for subscription updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational and professional development purposes.
