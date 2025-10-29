import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Extract user identifier (email or userId from token)
    const userIdentifier =
      req.user.id || req.user.sub || req.user.userId || req.user.email;
    if (!userIdentifier) {
      throw new BadRequestException('User ID not found in token');
    }

    // For Phase 2, we'll look up user by email if provided
    // In production, this should use proper JWT with userId
    const userId = await this.filesService.getUserIdFromIdentifier(
      userIdentifier,
    );
    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const uploadedFile = await this.filesService.createFile(
      userId,
      file.originalname,
      file.size,
      file.buffer,
    );

    return {
      success: true,
      file: {
        id: uploadedFile.id,
        fileName: uploadedFile.fileName,
        fileSize: uploadedFile.fileSize,
        status: uploadedFile.status,
        uploadedAt: uploadedFile.uploadedAt,
      },
    };
  }

  @Get()
  async getUserFiles(@Request() req) {
    // Extract user identifier (email or userId from token)
    const userIdentifier =
      req.user.id || req.user.sub || req.user.userId || req.user.email;
    if (!userIdentifier) {
      throw new BadRequestException('User ID not found in token');
    }

    // For Phase 2, we'll look up user by email if provided
    // In production, this should use proper JWT with userId
    const userId = await this.filesService.getUserIdFromIdentifier(
      userIdentifier,
    );
    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const files = await this.filesService.getUserFiles(userId);
    return {
      success: true,
      files: files.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        status: file.status,
        uploadedAt: file.uploadedAt,
        hasResumeData: !!file.resumeData,
      })),
    };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Request() req) {
    // Extract user identifier (email or userId from token)
    const userIdentifier =
      req.user.id || req.user.sub || req.user.userId || req.user.email;
    if (!userIdentifier) {
      throw new BadRequestException('User ID not found in token');
    }

    // For Phase 2, we'll look up user by email if provided
    // In production, this should use proper JWT with userId
    const userId = await this.filesService.getUserIdFromIdentifier(
      userIdentifier,
    );
    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const file = await this.filesService.getFileById(id, userId);
    return {
      success: true,
      file: {
        id: file.id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        status: file.status,
        uploadedAt: file.uploadedAt,
        resumeData: file.resumeData?.data || null,
      },
    };
  }

  @Get('credits/balance')
  async getCredits(@Request() req) {
    // Extract user identifier (email or userId from token)
    const userIdentifier =
      req.user.id || req.user.sub || req.user.userId || req.user.email;
    if (!userIdentifier) {
      throw new BadRequestException('User ID not found in token');
    }

    // For Phase 2, we'll look up user by email if provided
    // In production, this should use proper JWT with userId
    const userId = await this.filesService.getUserIdFromIdentifier(
      userIdentifier,
    );
    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const credits = await this.filesService.getUserCredits(userId);
    return {
      success: true,
      credits,
    };
  }
}
