"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Upload, File, X, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export function FileUpload({
  onFileSelect,
  isUploading = false,
  maxSize = 10,
  acceptedTypes = ["application/pdf"], // eslint-disable-line @typescript-eslint/no-unused-vars
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          toast.error(`File is too large. Maximum size is ${maxSize}MB`);
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          toast.error("Please upload a PDF file");
        } else {
          toast.error("File upload failed");
        }
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="w-full bg-gray-800 border-gray-600 shadow-lg">
      <CardContent className="p-6">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-blue-400 bg-blue-900/20"
                  : "border-gray-500 hover:border-blue-400 hover:bg-blue-900/10"
              }
              ${isUploading ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="mx-auto w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-lg font-semibold text-white mb-2">
              {isDragActive ? "Drop the PDF here" : "Upload a PDF file"}
            </p>
            <p className="text-sm text-gray-300 mb-4">
              Drag and drop or click to select
            </p>
            {/* Upload Guidelines */}
            <div className="text-xs text-gray-400 bg-gray-700 rounded-md px-3 py-2 inline-block text-left">
              Maximum file size: {maxSize}MB
              <br />
              Supported format: PDF only
              <br />
              Text-based PDFs work best
              <br />
              Each upload costs 100 credits
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-400" />
              <div>
                <p className="font-semibold text-green-300">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-green-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isUploading}
              className="text-green-400 hover:text-green-300 hover:bg-green-900/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="mt-4 flex items-center justify-center space-x-2 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
            <LoadingSpinner size="sm" />
            <span className="text-sm font-medium text-blue-300">
              Processing PDF...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
