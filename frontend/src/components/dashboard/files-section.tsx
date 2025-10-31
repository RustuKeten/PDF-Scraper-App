"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FolderOpen,
  Trash2,
} from "lucide-react";

interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  uploadedAt: string;
  hasResumeData: boolean;
}

interface FilesSectionProps {
  files: FileItem[];
  loading: boolean;
  onViewResumeData: (fileId: string) => void;
  onFileDelete?: (fileId: string) => void;
}

export function FilesSection({
  files,
  loading,
  onViewResumeData,
  onFileDelete,
}: FilesSectionProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-900 text-green-300 border-green-700">
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-900 text-red-300 border-red-700">
            Failed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-900 text-yellow-300 border-yellow-700">
            Processing
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-700 text-gray-300 border-gray-600">
            Uploaded
          </Badge>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            File History
          </h2>
          <p className="text-sm sm:text-base text-card-foreground">
            Loading your uploaded files...
          </p>
        </div>
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center text-gray-400">Loading files...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-2">
          File History
        </h2>
        <p className="text-sm sm:text-base text-card-foreground">
          {files.length === 0
            ? "No files uploaded yet"
            : `${files.length} file${files.length === 1 ? "" : "s"} uploaded`}
        </p>
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center text-gray-400">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p>
                No files uploaded yet. Upload your first PDF to get started!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <Card
              key={file.id}
              className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    {getStatusIcon(file.status)}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white text-sm sm:text-base truncate">
                        {file.fileName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 text-xs sm:text-sm text-gray-400">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="break-all sm:break-normal">
                          {formatDate(file.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end sm:justify-start space-x-2 sm:space-x-3 flex-shrink-0">
                    {getStatusBadge(file.status)}
                    {file.hasResumeData && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewResumeData(file.id)}
                        className="text-blue-400 border-blue-600 hover:bg-blue-900 hover:border-blue-500 text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">View Data</span>
                      </Button>
                    )}
                    {onFileDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFileDelete(file.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 text-xs sm:text-sm"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
