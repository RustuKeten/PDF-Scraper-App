import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Extract structured resume data from PDF text using OpenAI
   */
  async extractResumeData(pdfText: string): Promise<any> {
    try {
      const systemPrompt = `You are an expert at extracting structured data from resumes and CVs. 
Analyze the provided text and extract all relevant information into a structured JSON format.

The output must follow this exact structure:
{
  "profile": {
    "name": string,
    "surname": string,
    "email": string,
    "headline": string,
    "professionalSummary": string,
    "linkedIn": string | null,
    "website": string | null,
    "country": string,
    "city": string,
    "relocation": boolean,
    "remote": boolean
  },
  "workExperiences": [
    {
      "jobTitle": string,
      "employmentType": "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT",
      "locationType": "ONSITE" | "REMOTE" | "HYBRID",
      "company": string,
      "startMonth": number (1-12),
      "startYear": number,
      "endMonth": number (1-12) | null,
      "endYear": number | null,
      "current": boolean,
      "description": string
    }
  ],
  "educations": [
    {
      "school": string,
      "degree": "HIGH_SCHOOL" | "ASSOCIATE" | "BACHELOR" | "MASTER" | "DOCTORATE",
      "major": string,
      "startYear": number,
      "endYear": number,
      "current": boolean,
      "description": string
    }
  ],
  "skills": [string],
  "licenses": [
    {
      "name": string,
      "issuer": string,
      "issueYear": number,
      "description": string
    }
  ],
  "languages": [
    {
      "language": string,
      "level": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "NATIVE"
    }
  ],
  "achievements": [
    {
      "title": string,
      "organization": string,
      "achieveDate": string,
      "description": string
    }
  ],
  "publications": [
    {
      "title": string,
      "publisher": string,
      "publicationDate": string,
      "publicationUrl": string,
      "description": string
    }
  ],
  "honors": [
    {
      "title": string,
      "issuer": string,
      "issueMonth": number (1-12),
      "issueYear": number,
      "description": string
    }
  ]
}

Rules:
- If information is not available, use empty arrays or reasonable defaults
- For dates, infer from context if format is unclear
- Extract all information accurately and completely
- Return ONLY valid JSON, no additional text`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using mini for cost efficiency, can be upgraded to gpt-4o
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Extract structured data from this resume:\n\n${pdfText}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1, // Low temperature for consistent extraction
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse and validate JSON
      const extractedData = JSON.parse(content);
      this.logger.log('Successfully extracted resume data using OpenAI');

      return extractedData;
    } catch (error) {
      this.logger.error('Error extracting resume data with OpenAI:', error);
      throw new Error(`Failed to extract resume data: ${error.message}`);
    }
  }
}
