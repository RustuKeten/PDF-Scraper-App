import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// PDF parsing disabled for testing - will implement later
// import * as pdfParse from "pdf-parse";
// OpenAI imports disabled for testing without API calls
// import OpenAI from "openai";
// import { ResumeData } from "@/types/resume";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// For files > 4MB, we'll use a direct client-side upload approach
// Vercel serverless functions have a 4.5MB payload limit
const VERCEL_PAYLOAD_LIMIT = 4 * 1024 * 1024; // 4MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Extract text from PDF buffer - Simplified for testing
 */
async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    // For testing, return a mock text instead of parsing PDF
    // This avoids the pdf-parse library issues in serverless environment
    console.log(`Processing PDF buffer of size: ${pdfBuffer.length} bytes`);

    // Return mock text for testing
    const mockText = `Mock PDF Text Extraction
File Size: ${pdfBuffer.length} bytes
Extracted at: ${new Date().toISOString()}

This is a test extraction without actual PDF parsing.
In production, this would contain the actual PDF text content.

For now, we're testing the upload and database storage functionality.`;

    return mockText;
  } catch (error) {
    console.error("Error in mock PDF extraction:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// OpenAI extraction function disabled for testing
// async function extractResumeData(pdfText: string): Promise<ResumeData> {
//   // ... OpenAI code commented out
// }

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check user credits (if implementing credit system)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Skip credit check for testing without OpenAI
    // const CREDITS_REQUIRED = 100;
    // if (user.credits < CREDITS_REQUIRED) {
    //   return NextResponse.json(
    //     {
    //       error: "Insufficient credits",
    //       message: `You need ${CREDITS_REQUIRED} credits to process a file. You have ${user.credits} credits remaining.`,
    //     },
    //     { status: 402 }
    //   );
    // }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Check if file exceeds Vercel payload limit
    if (file.size > VERCEL_PAYLOAD_LIMIT) {
      return NextResponse.json(
        {
          error: "File too large for direct upload",
          message:
            "Files larger than 4MB must be uploaded using an alternate method (e.g., direct client-side upload to Supabase Storage). Please see README for details.",
        },
        { status: 413 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // Create file record
    const fileRecord = await prisma.file.create({
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: userId,
        status: "processing",
      },
    });

    // Create initial history entry
    await prisma.resumeHistory.create({
      data: {
        userId: userId,
        fileId: fileRecord.id,
        action: "upload",
        status: "success",
        message: "File uploaded successfully",
      },
    });

    try {
      // Extract text from PDF
      await prisma.resumeHistory.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          action: "process",
          status: "pending",
          message: "Extracting text from PDF...",
        },
      });

      const pdfText = await extractTextFromPDF(pdfBuffer);

      if (!pdfText || pdfText.length < 50) {
        throw new Error(
          "Could not extract sufficient text from PDF. The PDF may be image-based or corrupted."
        );
      }

      // Skip OpenAI extraction for testing - just save raw text
      await prisma.resumeHistory.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          action: "extract",
          status: "pending",
          message: "Saving raw PDF text (OpenAI disabled for testing)...",
        },
      });

      // Save raw text instead of structured data
      const rawTextData = {
        rawText: pdfText,
        extractedAt: new Date().toISOString(),
        note: "Raw text extraction - OpenAI processing disabled for testing",
      };

      await prisma.resumeData.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          data: JSON.parse(JSON.stringify(rawTextData)),
        },
      });

      // Update file status
      await prisma.file.update({
        where: { id: fileRecord.id },
        data: { status: "completed" },
      });

      // Skip credit deduction for testing
      // await prisma.user.update({
      //   where: { id: userId },
      //   data: {
      //     credits: {
      //       decrement: CREDITS_REQUIRED,
      //     },
      //   },
      // });

      // Create success history entry
      await prisma.resumeHistory.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          action: "extract",
          status: "success",
          message: "Raw PDF text extracted successfully (OpenAI disabled)",
        },
      });

      return NextResponse.json({
        success: true,
        file: {
          id: fileRecord.id,
          fileName: fileRecord.fileName,
          fileSize: fileRecord.fileSize,
          status: "completed",
          uploadedAt: fileRecord.uploadedAt,
        },
      });
    } catch (error: unknown) {
      // Update file status to failed
      await prisma.file.update({
        where: { id: fileRecord.id },
        data: { status: "failed" },
      });

      const errorMessage =
        error instanceof Error ? error.message : "Processing failed";

      // Create error history entry
      await prisma.resumeHistory.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          action: "extract",
          status: "failed",
          message: errorMessage,
        },
      });

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
