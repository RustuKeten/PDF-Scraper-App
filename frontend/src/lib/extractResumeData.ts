import { ResumeData } from "../types/resume";

/**
 * Extract structured resume data using OpenAI
 * OPTIMIZED FOR PRODUCTION:
 * - Timeout handling
 * - Retry logic with exponential backoff
 * - Text preprocessing to reduce tokens
 * - Optimized prompt structure
 */
const OPENAI_TIMEOUT = 60000; // 60 seconds timeout
const MAX_RETRIES = 3;
const MAX_TEXT_LENGTH = 20000; // Limit text to ~5000 tokens (roughly 4 chars per token)

/**
 * Preprocess text to reduce token usage while preserving important information
 */
function preprocessText(text: string): string {
  // Remove excessive whitespace and newlines
  let cleaned = text
    .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2
    .replace(/[ \t]{2,}/g, " ") // Replace multiple spaces with single
    .trim();

  // Truncate if too long (keep first part which usually has most important info)
  if (cleaned.length > MAX_TEXT_LENGTH) {
    cleaned = cleaned.substring(0, MAX_TEXT_LENGTH) + "...[truncated]";
    console.log(
      `[Preprocessing] Text truncated from ${text.length} to ${cleaned.length} characters`
    );
  }

  return cleaned;
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const isLastAttempt = attempt === maxRetries - 1;

      // Don't retry on certain errors
      if (
        error instanceof Error &&
        (error.message.includes("Invalid API key") ||
          error.message.includes("rate limit") ||
          error.message.includes("insufficient_quota"))
      ) {
        throw error;
      }

      if (isLastAttempt) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(
        `[Retry] Attempt ${
          attempt + 1
        }/${maxRetries} failed. Retrying in ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Unknown error");
}

export async function extractResumeData(
  extractedText: string
): Promise<ResumeData> {
  try {
    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured in environment variables"
      );
    }

    // Validate API key format
    if (!apiKey.startsWith("sk-") && !apiKey.startsWith("sk-proj-")) {
      throw new Error(
        `OPENAI_API_KEY format appears invalid. Expected to start with 'sk-' or 'sk-proj-', but got prefix: ${apiKey.substring(
          0,
          10
        )}`
      );
    }

    // Preprocess text to reduce token usage
    const processedText = preprocessText(extractedText);
    console.log(
      `[OpenAI] Processing text (${processedText.length} chars, reduced from ${extractedText.length})`
    );

    // Dynamic import to avoid serverless environment issues
    const { default: OpenAI } = await import("openai");
    const openaiClient = new OpenAI({
      apiKey: apiKey,
      timeout: OPENAI_TIMEOUT,
      maxRetries: 0, // We handle retries ourselves
    });

    // Optimized, more concise prompt to reduce tokens
    const systemPrompt = `Extract resume data into this JSON structure:
{
  "profile": {
    "name": "string", "surname": "string", "email": "string",
    "headline": "string", "professionalSummary": "string",
    "linkedIn": "string|null", "website": "string|null",
    "country": "string", "city": "string",
    "relocation": boolean, "remote": boolean
  },
  "workExperiences": [{
    "jobTitle": "string", "employmentType": "FULL_TIME|PART_TIME|INTERNSHIP|CONTRACT",
    "locationType": "ONSITE|REMOTE|HYBRID", "company": "string",
    "startMonth": 1-12, "startYear": number,
    "endMonth": "number|null", "endYear": "number|null",
    "current": boolean, "description": "string"
  }],
  "educations": [{
    "school": "string", "degree": "HIGH_SCHOOL|ASSOCIATE|BACHELOR|MASTER|DOCTORATE",
    "major": "string", "startYear": number, "endYear": number,
    "current": boolean, "description": "string"
  }],
  "skills": ["string"],
  "licenses": [{
    "name": "string", "issuer": "string", "issueYear": number, "description": "string"
  }],
  "languages": [{
    "language": "string", "level": "BEGINNER|INTERMEDIATE|ADVANCED|NATIVE"
  }],
  "achievements": [{
    "title": "string", "organization": "string",
    "achieveDate": "YYYY-MM", "description": "string"
  }],
  "publications": [{
    "title": "string", "publisher": "string",
    "publicationDate": "ISO8601", "publicationUrl": "string", "description": "string"
  }],
  "honors": [{
    "title": "string", "issuer": "string",
    "issueMonth": 1-12, "issueYear": number, "description": "string"
  }]
}

Rules: Use empty arrays [] for missing data. When "current":true, set endMonth/endYear to null. Use null (not "") for optional fields like linkedIn/website. Return ONLY valid JSON.`;

    // Retry logic with exponential backoff for resilience
    const response = await retryWithBackoff(async () => {
      console.log(
        `[OpenAI] Making API call with timeout ${OPENAI_TIMEOUT}ms...`
      );

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(`OpenAI API call timed out after ${OPENAI_TIMEOUT}ms`)
          );
        }, OPENAI_TIMEOUT);
      });

      // Race between API call and timeout
      const apiPromise = openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Extract structured data from this resume:\n\n${processedText}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 4096,
      });

      return Promise.race([apiPromise, timeoutPromise]);
    });

    // Extract JSON from response
    const extractedDataText =
      response.choices[0]?.message?.content?.trim() || "";

    if (!extractedDataText) {
      throw new Error("OpenAI did not return any content");
    }

    console.log(
      `[OpenAI] ✅ Received response (${extractedDataText.length} chars)`
    );

    // Parse JSON from the response
    let extractedData: ResumeData;
    try {
      extractedData = JSON.parse(extractedDataText) as ResumeData;
    } catch (parseError) {
      console.error(
        "Failed to parse JSON:",
        extractedDataText.substring(0, 200)
      );
      throw new Error(
        `OpenAI response is not valid JSON: ${
          parseError instanceof Error ? parseError.message : "Unknown error"
        }`
      );
    }

    console.log("✅ Successfully extracted resume data");
    return extractedData;
  } catch (error) {
    console.error("Error extracting resume data:", error);
    throw new Error(
      `Failed to extract resume data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
