import { prisma } from "./prisma";
import { ResumeData } from "@/types/resume";

export class DatabaseService {
  // User operations
  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        files: {
          orderBy: { uploadedAt: "desc" },
        },
        resumeData: {
          include: {
            file: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async updateUserCredits(userId: string, credits: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: { credits },
    });
  }

  // File operations
  static async createFile(data: {
    fileName: string;
    fileSize: number;
    fileType: string;
    userId: string;
    storagePath?: string;
  }) {
    return await prisma.file.create({
      data: {
        ...data,
        status: "uploaded",
      },
    });
  }

  static async updateFileStatus(fileId: string, status: string) {
    return await prisma.file.update({
      where: { id: fileId },
      data: { status },
    });
  }

  static async getFileById(fileId: string) {
    return await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        user: true,
        resumeData: true,
      },
    });
  }

  static async getUserFiles(userId: string) {
    return await prisma.file.findMany({
      where: { userId },
      include: {
        resumeData: true,
      },
      orderBy: { uploadedAt: "desc" },
    });
  }

  // Resume data operations
  static async createResumeData(data: {
    userId: string;
    fileId: string;
    data: ResumeData;
  }) {
    return await prisma.resumeData.create({
      data: {
        ...data,
        data: data.data as any, // Prisma will handle JSON serialization
      },
    });
  }

  static async getResumeDataByFileId(fileId: string) {
    return await prisma.resumeData.findUnique({
      where: { fileId },
      include: {
        file: true,
        user: true,
      },
    });
  }

  // History operations
  static async createHistoryEntry(data: {
    userId: string;
    fileId: string;
    action: string;
    status: string;
    message?: string;
  }) {
    return await prisma.resumeHistory.create({
      data,
    });
  }

  static async getUserHistory(userId: string) {
    return await prisma.resumeHistory.findMany({
      where: { userId },
      include: {
        file: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Credit operations
  static async checkUserCredits(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    return user?.credits || 0;
  }

  static async deductCredits(userId: string, amount: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
  }
}
