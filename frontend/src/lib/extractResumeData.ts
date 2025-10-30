import { ResumeData } from "../types/resume";

/**
 * Extract structured resume data using OpenAI
 * SIMPLEST APPROACH: Only 1 API call!
 * 1. PDF text extracted using pdf2json (serverless-friendly)
 * 2. Send extracted text to OpenAI (1 API call)
 */
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

    console.log(
      `[OpenAI] Processing extracted text (${extractedText.length} characters) - 1 API call only!`
    );

    // Dynamic import to avoid serverless environment issues
    const { default: OpenAI } = await import("openai");
    const openaiClient = new OpenAI({
      apiKey: apiKey,
    });

    const systemPrompt = `You are an expert at extracting structured data from resumes and CVs. 
Analyze the provided resume text and extract all relevant information into a structured JSON format.

You must return valid JSON that conforms to the following structure. Ensure all fields match the specified types and formats.

JSON Structure:
{
  "profile": {
    "name": "string",
    "surname": "string",
    "email": "string",
    "headline": "string",
    "professionalSummary": "string",
    "linkedIn": "string (optional)",
    "website": "string (optional)",
    "country": "string",
    "city": "string",
    "relocation": boolean,
    "remote": boolean
  },
  "workExperiences": [
    {
      "jobTitle": "string",
      "employmentType": "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT",
      "locationType": "ONSITE" | "REMOTE" | "HYBRID",
      "company": "string",
      "startMonth": number (1-12),
      "startYear": number,
      "endMonth": number | null,
      "endYear": number | null,
      "current": boolean,
      "description": "string"
    }
  ],
  "educations": [
    {
      "school": "string",
      "degree": "HIGH_SCHOOL" | "ASSOCIATE" | "BACHELOR" | "MASTER" | "DOCTORATE",
      "major": "string",
      "startYear": number,
      "endYear": number,
      "current": boolean,
      "description": "string"
    }
  ],
  "skills": ["string"],
  "licenses": [
    {
      "name": "string",
      "issuer": "string",
      "issueYear": number,
      "description": "string"
    }
  ],
  "languages": [
    {
      "language": "string",
      "level": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "NATIVE"
    }
  ],
  "achievements": [
    {
      "title": "string",
      "organization": "string",
      "achieveDate": "string (YYYY-MM format)",
      "description": "string"
    }
  ],
  "publications": [
    {
      "title": "string",
      "publisher": "string",
      "publicationDate": "string (ISO 8601 format)",
      "publicationUrl": "string",
      "description": "string"
    }
  ],
  "honors": [
    {
      "title": "string",
      "issuer": "string",
      "issueMonth": number (1-12),
      "issueYear": number,
      "description": "string"
    }
  ]
}

Rules:
- If information is not available, use empty arrays or reasonable defaults
- For dates, infer from context if format is unclear
- Extract all information accurately and completely
- Return ONLY valid JSON, no additional text
- Ensure all enum values match the specified values exactly
- If a field is not found, use empty string (for strings) or false (for booleans)`;

    // Single API call using chat.completions
    console.log(`[OpenAI] Making chat.completions call (1 API call only)...`);

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Extract structured data from this resume:\n\n${extractedText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 4096,
    });

    // Extract JSON from response
    const extractedDataText =
      response.choices[0]?.message?.content?.trim() || "";

    if (!extractedDataText) {
      throw new Error("OpenAI did not return any content");
    }

    console.log(
      `[OpenAI] ✅ Received response (${extractedDataText.length} characters) - 1 API call total!`
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

    console.log(
      "✅ Successfully extracted resume data - Total cost: 1 OpenAI API call (cheapest approach!)"
    );
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
