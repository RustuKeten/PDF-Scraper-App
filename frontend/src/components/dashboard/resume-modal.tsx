/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: any;
  fileName?: string;
}

export function ResumeModal({
  isOpen,
  onClose,
  resumeData,
  fileName,
}: ResumeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    try {
      const jsonString = JSON.stringify(resumeData, null, 2);
      navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success("JSON copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy JSON");
    }
  };

  if (!resumeData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="bg-white max-w-2xl w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5 text-blue-600" />
              Resume Data {fileName && `- ${fileName}`}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-center py-8">
              No data available
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="bg-white max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4 border-b gap-2">
          <CardTitle className="flex items-center gap-2 text-gray-900 text-sm sm:text-base">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <span className="break-words">Resume Data {fileName && `- ${fileName}`}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJson}
              className="text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Copy JSON</span>
                  <span className="sm:hidden">Copy</span>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)] p-0">
          <pre className="bg-gray-900 text-gray-100 p-3 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto rounded-lg m-2 sm:m-4">
            {JSON.stringify(resumeData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
