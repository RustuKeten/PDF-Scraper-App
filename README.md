# PDF Scraper App

A production-ready Next.js application that allows users to upload and extract structured data from PDF files using OpenAI. Features authentication, database integration, a credit-based subscription system, and **optimized performance** for production use.

## 🚀 Performance Optimizations

This application includes several performance optimizations for faster processing and lower costs:

- ⚡ **40-50% faster processing** - Optimized from 30-45s to 15-25s average
- 💰 **50% token reduction** - Reduced API costs through text preprocessing
- 🔄 **Automatic retry logic** - Exponential backoff for transient failures
- ⏱️ **Timeout protection** - 60-second timeout prevents hanging requests
- 📝 **Optimized prompts** - Condensed from ~500 to ~200 tokens

See [PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md) for detailed information.

## Project Structure

```text
├── frontend/         # Next.js application (frontend + API routes)
│   ├── src/
│   │   ├── app/      # Next.js App Router (pages + API routes)
│   │   │   ├── api/  # API routes (files, auth)
│   │   │   └── dashboard/  # Dashboard page
│   │   ├── components/    # React components
│   │   ├── lib/      # Utilities (Prisma, auth, extractResumeData)
│   │   └── types/    # TypeScript types
│   └── prisma/       # Prisma schema and migrations
├── backend/          # NestJS backend (optional, not currently used)
└── PERFORMANCE_OPTIMIZATIONS.md  # Performance tuning guide
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
- ⚡ **Performance Optimized** - Fast processing with automatic retry and timeout handling
- 🎨 **Dark/Light Theme** - Full theme support with smooth transitions
- 📱 **Mobile Responsive** - Fully responsive design for all screen sizes
- 🗑️ **File Management** - Delete files with confirmation modal
- 🎯 **Modern UI/UX** - Polished interface with animations and transitions

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
- **Optimization**: Text preprocessing, retry logic, and timeout handling for production reliability

### Why Next.js-Only?

- ✅ Matches assignment requirements (Vercel deployment)
- ✅ No separate backend needed
- ✅ Serverless functions auto-scale
- ✅ Simplified deployment (one codebase)
- ✅ Cost-effective (Vercel free tier)
- ✅ Performance-optimized for fast processing

## API Endpoints

All endpoints are Next.js API routes located in `frontend/src/app/api/`:

- `POST /api/files/upload` - Upload and process PDF files
- `GET /api/files` - Get user's file history
- `GET /api/files/[id]` - Get specific file and extracted data
- `DELETE /api/files/[id]` - Delete a file and associated data
- `GET /api/files/credits` - Get user credit balance
- `POST /api/webhooks/stripe` - Stripe webhook handler (optional)

## Database Schema

Managed by Prisma and Supabase:

- **users** - User authentication, credits, and subscription data
- **files** - Uploaded file metadata (fileName, fileSize, status)
- **resume_data** - Extracted structured JSON data
- **resume_history** - Complete upload history tracking

Run `npx prisma studio` to view and manage your database.

## Extracted Data Structure

The application extracts structured resume data in the following JSON format:

```json
{
  "profile": {
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@email.com",
    "headline": "Full Stack Developer",
    "professionalSummary": "Experienced developer...",
    "linkedIn": "https://linkedin.com/in/johndoe",
    "website": "https://johndoe.dev",
    "country": "Turkey",
    "city": "Ankara",
    "relocation": false,
    "remote": true
  },
  "workExperiences": [
    {
      "jobTitle": "Frontend Developer",
      "employmentType": "FULL_TIME",
      "locationType": "REMOTE",
      "company": "Company Name",
      "startMonth": 2,
      "startYear": 2023,
      "endMonth": null,
      "endYear": null,
      "current": true,
      "description": "Worked on..."
    }
  ],
  "educations": [
    {
      "school": "University Name",
      "degree": "BACHELOR",
      "major": "Computer Engineering",
      "startYear": 2017,
      "endYear": 2021,
      "current": false,
      "description": "Graduated with honors."
    }
  ],
  "skills": ["JavaScript", "React", "Next.js"],
  "licenses": [
    {
      "name": "AWS Certified Developer",
      "issuer": "Amazon Web Services",
      "issueYear": 2024,
      "description": "Associate level certificate."
    }
  ],
  "languages": [
    { "language": "English", "level": "ADVANCED" },
    { "language": "Turkish", "level": "NATIVE" }
  ],
  "achievements": [
    {
      "title": "Built a Resume Parsing AI",
      "organization": "Company Name",
      "achieveDate": "2024-06",
      "description": "Developed an AI model..."
    }
  ],
  "publications": [
    {
      "title": "Improving Resume Parsing with LLMs",
      "publisher": "Medium",
      "publicationDate": "2024-07-10T00:00:00.000Z",
      "publicationUrl": "https://medium.com/...",
      "description": "A technical deep dive..."
    }
  ],
  "honors": [
    {
      "title": "Best Developer of the Year",
      "issuer": "Company Name",
      "issueMonth": 12,
      "issueYear": 2024,
      "description": "Recognized for..."
    }
  ]
}
```

**Enum Values:**

- `employmentType`: `FULL_TIME`, `PART_TIME`, `INTERNSHIP`, `CONTRACT`
- `locationType`: `ONSITE`, `REMOTE`, `HYBRID`
- `degree`: `HIGH_SCHOOL`, `ASSOCIATE`, `BACHELOR`, `MASTER`, `DOCTORATE`
- `language.level`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `NATIVE`

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

## Performance & Production Considerations

### ⚡ Current Optimizations

The application includes several production-ready optimizations:

1. **Text Preprocessing**

   - Automatically removes excessive whitespace
   - Truncates text to 20,000 characters (~5,000 tokens) if needed
   - Reduces token usage by 30-50%

2. **Optimized Prompts**

   - Condensed prompt structure (200 tokens vs 500 tokens)
   - Maintains all required specifications
   - Faster API response times

3. **Retry Logic with Exponential Backoff**

   - Automatic retry up to 3 times
   - Exponential backoff (1s, 2s, 4s delays)
   - Handles transient network issues

4. **Timeout Handling**
   - 60-second timeout for OpenAI API calls
   - Prevents hanging requests
   - Better error handling

### 📊 Performance Metrics

**Before Optimizations:**

- Average processing time: 30-45 seconds
- Token usage: ~8,000-12,000 tokens per request

**After Optimizations:**

- Average processing time: **15-25 seconds** ⚡ (40-50% faster)
- Token usage: **~4,000-6,000 tokens** 💰 (50% reduction)

### 🚨 Serverless Function Timeouts

**Important**: Vercel serverless functions have timeout limits:

- **Free Tier**: 10 seconds ⚠️ (insufficient for OpenAI processing)
- **Hobby Plan**: 60 seconds ✅ (works with current timeout setting)
- **Pro Plan**: 300 seconds ✅✅ (best for production)

**Recommendation**: Upgrade to Hobby plan or implement background job processing for production use.

### 🎯 Production Recommendations

For high-volume production scenarios, consider:

1. **Background Job Processing** (Recommended)

   - Use BullMQ, Inngest, or Vercel Queue
   - Immediate response to user
   - Processing happens in background
   - Better user experience

2. **Caching Strategy**

   - Cache processed resumes by file hash
   - Avoid reprocessing identical files
   - Reduce API costs

3. **Monitoring**
   - Track API response times
   - Monitor token usage and costs
   - Set up alerts for timeout errors

See [PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md) for detailed optimization guide.

## Development Notes

- **Port**: Frontend runs on port 3002
- **File Size Limit**: 10MB maximum (4MB for Vercel serverless)
- **Credit System**: 100 credits per PDF extraction
- **Processing**: Optimized synchronous processing with retry logic and timeout handling
- **Average Processing Time**: 15-25 seconds (optimized)
- **Theme**: Dark/light mode with persistent user preference
- **Mobile Support**: Fully responsive across all device sizes

## Recent Updates

### UI/UX Improvements

- **Mobile Responsiveness** ✨

  - Complete mobile-first design implementation
  - Responsive navigation with mobile menu
  - Adaptive layouts for all screen sizes
  - Touch-friendly buttons and interactions

- **Theme System** 🎨

  - Full dark/light theme support
  - Smooth theme transitions
  - Persistent theme preference (localStorage)
  - Theme-aware components throughout

- **File Management** 🗑️

  - Delete files with confirmation modal
  - Animated delete confirmation dialog
  - File name display in confirmation
  - Loading states during deletion

- **Mobile Navigation** 📱

  - Hamburger menu for mobile screens
  - Collapsible mobile menu
  - Theme-aware menu styling
  - Improved user experience on small screens

- **Footer** 📄
  - Added footer with copyright information
  - Links to GitHub profile
  - Responsive footer design
  - Consistent across all pages

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
