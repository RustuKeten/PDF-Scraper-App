import { Injectable, Logger } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import { createWorker } from 'tesseract.js';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  /**
   * Extract text from PDF buffer
   * Supports both text-based and image-based PDFs
   */
  async extractText(pdfBuffer: Buffer): Promise<string> {
    try {
      const data = await (pdfParse as any)(pdfBuffer);
      const text = data.text.trim();

      // If PDF has minimal text (likely scanned/image-based), try OCR
      if (text.length < 100 && data.numpages > 0) {
        this.logger.warn('PDF appears to be image-based, attempting OCR...');
        return await this.extractTextWithOCR(pdfBuffer);
      }

      return text;
    } catch (error) {
      this.logger.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Extract text using OCR (for image-based PDFs)
   */
  private async extractTextWithOCR(pdfBuffer: Buffer): Promise<string> {
    try {
      // Note: This is a basic implementation
      // For production, consider using a more robust OCR solution
      // or converting PDF to images first
      const worker = await createWorker('eng');
      const { data } = await worker.recognize(pdfBuffer);
      await worker.terminate();

      return data.text.trim();
    } catch (error) {
      this.logger.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text using OCR');
    }
  }

  /**
   * Get PDF metadata
   */
  async getMetadata(pdfBuffer: Buffer): Promise<{
    numPages: number;
    info: any;
  }> {
    try {
      const data = await (pdfParse as any)(pdfBuffer);
      return {
        numPages: data.numpages,
        info: data.info,
      };
    } catch (error) {
      this.logger.error('Error getting PDF metadata:', error);
      throw new Error('Failed to get PDF metadata');
    }
  }
}
