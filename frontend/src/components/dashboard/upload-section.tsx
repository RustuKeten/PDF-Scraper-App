"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { FileUp } from "lucide-react";

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function UploadSection({
  onFileSelect,
  isUploading,
}: UploadSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">PDF File Upload</h2>
        <p className="text-black">
          Upload your resume or CV to extract structured data
        </p>
      </div>

      {/* Upload Card */}
      <Card className="bg-gray-900 border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileUp className="h-5 w-5 text-blue-400" />
            PDF Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={onFileSelect}
            isUploading={isUploading}
            maxSize={10}
            acceptedTypes={["application/pdf"]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
