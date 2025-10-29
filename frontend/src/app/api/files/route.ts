import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const files = await prisma.file.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
      include: {
        resumeData: {
          select: { id: true },
        },
      },
    });

    const filesWithStatus = files.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileSize: file.fileSize,
      status: file.status,
      uploadedAt: file.uploadedAt.toISOString(),
      hasResumeData: !!file.resumeData,
    }));

    return NextResponse.json({
      success: true,
      files: filesWithStatus,
    });
  } catch (error: unknown) {
    console.error("Fetch files error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
