import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId, // Ensure user can only access their own files
      },
      include: {
        resumeData: true,
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      file: {
        id: file.id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        status: file.status,
        uploadedAt: file.uploadedAt.toISOString(),
        resumeData: file.resumeData?.data || null,
      },
    });
  } catch (error: unknown) {
    console.error("Fetch file error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
