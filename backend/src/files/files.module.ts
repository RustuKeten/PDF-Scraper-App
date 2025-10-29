import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File } from '../entities/file.entity';
import { User } from '../entities/user.entity';
import { ResumeData } from '../entities/resume-data.entity';
import { ResumeHistory } from '../entities/resume-history.entity';
import { PdfService } from '../services/pdf.service';
import { OpenAIService } from '../services/openai.service';

@Module({
  imports: [TypeOrmModule.forFeature([File, User, ResumeData, ResumeHistory])],
  controllers: [FilesController],
  providers: [FilesService, PdfService, OpenAIService],
  exports: [FilesService],
})
export class FilesModule {}
