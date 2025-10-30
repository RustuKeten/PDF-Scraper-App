import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractResumeData } from "@/lib/extractResumeData";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

// For files > 4MB, we'll use a direct client-side upload approach
// Vercel serverless functions have a 4.5MB payload limit
const VERCEL_PAYLOAD_LIMIT = 4 * 1024 * 1024; // 4MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CREDITS_REQUIRED = 100;

/**
 * Extract text from PDF using pdf2json (serverless-friendly approach)
 * Works by writing to /tmp and reading from file system
 */
async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  const fileName = uuidv4();
  const tempFilePath = `/tmp/${fileName}.pdf`;

  try {
    console.log(
      `[PDF Extraction] Writing PDF to temp file: ${tempFilePath} (${pdfBuffer.length} bytes)`
    );

    // Write PDF buffer to temp file (Vercel provides /tmp directory)
    await fs.writeFile(tempFilePath, pdfBuffer);

    // Create PDF parser instance - using exact same approach as reference app
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParser = new (PDFParser as any)(null, 1);

    // Extract text using promise-based approach
    const parsedText = await new Promise<string>((resolve, reject) => {
      let resolved = false;

      pdfParser.on("pdfParser_dataError", (errData: unknown) => {
        const errorData = errData as { parserError?: string };
        console.error("[PDF Extraction] Parsing error:", errorData.parserError);
        if (!resolved) {
          resolved = true;
          reject(
            new Error(
              `PDF parsing failed: ${errorData.parserError || "Unknown error"}`
            )
          );
        }
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const extractedText = pdfParser.getRawTextContent();
        console.log(
          `[PDF Extraction] Extracted text length: ${
            extractedText?.length || 0
          } characters`
        );
        console.log(
          `[PDF Extraction] First 200 chars: ${
            extractedText?.substring(0, 200) || "empty"
          }`
        );

        if (!resolved) {
          resolved = true;
          resolve(extractedText || "");
        }
      });

      console.log(`[PDF Extraction] Loading PDF from: ${tempFilePath}`);
      pdfParser.loadPDF(tempFilePath);
    });

    // Clean up temp file
    try {
      await fs.unlink(tempFilePath);
      console.log(`[PDF Extraction] Cleaned up temp file: ${tempFilePath}`);
    } catch (cleanupError) {
      console.warn(
        "[PDF Extraction] Failed to cleanup temp file:",
        cleanupError
      );
    }

    console.log(
      `[PDF Extraction] Final extracted text length: ${parsedText?.length || 0}`
    );

    if (!parsedText || parsedText.trim().length < 20) {
      console.warn(
        `[PDF Extraction] Extracted text is too short (${
          parsedText?.length || 0
        } chars)`
      );
      throw new Error(
        "PDF contains no extractable text. This might be an image-based PDF. Please ensure the PDF contains selectable text."
      );
    }

    return parsedText.trim();
  } catch (error) {
    // Clean up temp file on error
    try {
      await fs.unlink(tempFilePath).catch(() => {
        // Ignore cleanup errors
      });
    } catch {
      // Ignore cleanup errors
    }

    console.error("[PDF Extraction] Error extracting PDF text:", error);
    throw new Error(
      `Failed to extract text from PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has sufficient credits
    if (user.credits < CREDITS_REQUIRED) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          message: `You need ${CREDITS_REQUIRED} credits to process a file. You have ${user.credits} credits remaining.`,
        },
        { status: 402 }
      );
    }

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
      // Step 1: Extract text from PDF using pdf2json
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

      // Step 2: Extract structured data using OpenAI (1 API call only!)
      await prisma.resumeHistory.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          action: "extract",
          status: "pending",
          message: "Processing with OpenAI...",
        },
      });

      const resumeData = await extractResumeData(pdfText);

      // Save structured resume data
      await prisma.resumeData.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          data: JSON.parse(JSON.stringify(resumeData)),
        },
      });

      // Update file status
      await prisma.file.update({
        where: { id: fileRecord.id },
        data: { status: "completed" },
      });

      // Deduct credits for processing
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: CREDITS_REQUIRED,
          },
        },
      });

      // Create success history entry
      await prisma.resumeHistory.create({
        data: {
          userId: userId,
          fileId: fileRecord.id,
          action: "extract",
          status: "success",
          message: "Resume data extracted successfully",
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
