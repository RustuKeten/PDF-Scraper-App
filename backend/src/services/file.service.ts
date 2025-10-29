import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { User } from '../entities/user.entity';
import { ResumeData } from '../entities/resume-data.entity';
import { ResumeHistory } from '../entities/resume-history.entity';
import { PdfService } from './pdf.service';
import { OpenAIService } from './openai.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ResumeData)
    private resumeDataRepository: Repository<ResumeData>,
    @InjectRepository(ResumeHistory)
    private resumeHistoryRepository: Repository<ResumeHistory>,
    private pdfService: PdfService,
    private openAIService: OpenAIService,
  ) {}

  /**
   * Create a new file record
   */
  async createFile(
    userId: string,
    fileName: string,
    fileSize: number,
    fileBuffer: Buffer,
    storagePath?: string,
  ): Promise<File> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has enough credits (assume 10 credits per file)
    const requiredCredits = 10;
    if (user.credits < requiredCredits) {
      throw new BadRequestException(
        `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`,
      );
    }

    // Create file record
    const file = this.fileRepository.create({
      fileName,
      fileSize,
      fileType: 'application/pdf',
      userId,
      storagePath,
      status: 'uploaded',
    });

    await this.fileRepository.save(file);

    // Create history record
    await this.createHistory(userId, file.id, 'upload', 'success', null);

    // Process file asynchronously
    this.processFile(userId, file.id, fileBuffer).catch((error) => {
      this.logger.error(`Error processing file ${file.id}:`, error);
    });

    return file;
  }

  /**
   * Process PDF file: extract text and structured data
   */
  private async processFile(
    userId: string,
    fileId: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    try {
      // Update status to processing
      file.status = 'processing';
      await this.fileRepository.save(file);
      await this.createHistory(userId, fileId, 'process', 'pending', null);

      // Extract text from PDF
      const pdfText = await this.pdfService.extractText(fileBuffer);
      this.logger.log(`Extracted ${pdfText.length} characters from PDF`);

      // Extract structured data using OpenAI
      const resumeData = await this.openAIService.extractResumeData(pdfText);

      // Save extracted data
      const resumeDataEntity = this.resumeDataRepository.create({
        userId,
        fileId,
        data: resumeData,
      });
      await this.resumeDataRepository.save(resumeDataEntity);

      // Update file status
      file.status = 'completed';
      await this.fileRepository.save(file);

      // Deduct credits
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        const creditsToDeduct = 10;
        user.credits = Math.max(0, user.credits - creditsToDeduct);
        await this.userRepository.save(user);
      }

      // Create history record
      await this.createHistory(
        userId,
        fileId,
        'extract',
        'success',
        'Successfully extracted resume data',
      );

      this.logger.log(`Successfully processed file ${fileId}`);
    } catch (error) {
      this.logger.error(`Error processing file ${fileId}:`, error);
      file.status = 'failed';
      await this.fileRepository.save(file);
      await this.createHistory(
        userId,
        fileId,
        'extract',
        'failed',
        error.message,
      );
      throw error;
    }
  }

  /**
   * Get all files for a user
   */
  async getUserFiles(userId: string): Promise<File[]> {
    return this.fileRepository.find({
      where: { userId },
      relations: ['resumeData'],
      order: { uploadedAt: 'DESC' },
    });
  }

  /**
   * Get a specific file with its resume data
   */
  async getFileById(fileId: string, userId: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, userId },
      relations: ['resumeData'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  /**
   * Create history record
   */
  private async createHistory(
    userId: string,
    fileId: string,
    action: string,
    status: string,
    message: string | null,
  ): Promise<void> {
    const history = this.resumeHistoryRepository.create({
      userId,
      fileId,
      action,
      status,
      message,
    });
    await this.resumeHistoryRepository.save(history);
  }

  /**
   * Get user's credit balance
   */
  async getUserCredits(userId: string): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.credits;
  }

  /**
   * Get user ID from identifier (email or userId)
   * For Phase 2: supports email lookup since NextAuth uses email
   */
  async getUserIdFromIdentifier(identifier: string): Promise<string | null> {
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log(`🔍 Looking up user with identifier: "${identifier}"`);

    // Try to find by ID first
    this.logger.log(`  → Trying to find by ID: ${identifier}`);
    let user = await this.userRepository.findOne({ where: { id: identifier } });

    if (user) {
      this.logger.log(`  ✅ Found user by ID: ${user.id} (${user.email})`);
      return user.id;
    }
    this.logger.log(`  ❌ No user found with ID: ${identifier}`);

    // If not found, try by email
    this.logger.log(`  → Trying to find by email: ${identifier}`);
    user = await this.userRepository.findOne({
      where: { email: identifier },
    });

    if (user) {
      this.logger.log(`  ✅ Found user by email: ${user.id} (${user.email})`);
      return user.id;
    }

    // Log all users for debugging
    this.logger.log(`  ❌ No user found with email: ${identifier}`);
    this.logger.log(`  📋 Checking all users in database...`);
    const allUsers = await this.userRepository.find({
      select: ['id', 'email'],
      take: 20,
    });
    this.logger.log(`  📊 Found ${allUsers.length} users in database:`);
    allUsers.forEach((u, index) => {
      this.logger.log(`    ${index + 1}. ID: ${u.id}, Email: ${u.email}`);
    });

    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return null;
  }
}
