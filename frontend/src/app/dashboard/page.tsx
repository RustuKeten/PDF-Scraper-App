"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatsSection } from "@/components/dashboard/stats-section";
import { UploadSection } from "@/components/dashboard/upload-section";
import { FilesSection } from "@/components/dashboard/files-section";
import { ResumeModal } from "@/components/dashboard/resume-modal";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap } from "lucide-react";

interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  uploadedAt: string;
  hasResumeData: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [creditsRemaining, setCreditsRemaining] = useState(1000);
  const [planType, setPlanType] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);

  // Fetch user data on mount
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchFiles();
    fetchCredits();
  }, [session, status, router]);

  // Poll for file updates while processing
  useEffect(() => {
    if (
      files.some((f) => f.status === "uploaded" || f.status === "processing")
    ) {
      const interval = setInterval(() => {
        fetchFiles();
        fetchCredits();
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [files]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/files/credits");
      if (response.ok) {
        const data = await response.json();
        setCreditsRemaining(data.credits || 1000);
        setPlanType(data.planType || "FREE");
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("File uploaded successfully! Processing...");
      await fetchFiles();
      await fetchCredits();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewResumeData = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`);
      if (response.ok) {
        const data = await response.json();
        setResumeData(data.file.resumeData);
        setSelectedFile(fileId);
      } else {
        toast.error("Failed to load resume data");
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
      toast.error("Failed to load resume data");
    }
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setResumeData(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* AI Processing Info - Top Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-black text-lg">
                AI-Powered PDF Extraction
              </h4>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="text-center bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session.user?.name || session.user?.email}!
            </h1>
            <p className="text-white">
              <p className="text-m">
                Our advanced AI analyzes your PDF and extracts structured
                data automatically
              </p>
            </p>
          </div>

          {/* Stats Section */}
          <StatsSection
            filesCount={files.length}
            creditsRemaining={creditsRemaining}
            planType={planType}
          />

          {/* Upload Section */}
          <UploadSection
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
          />

          {/* Files Section */}
          <FilesSection
            files={files}
            loading={loading}
            onViewResumeData={handleViewResumeData}
          />
        </div>
      </main>

      {/* Resume Data Modal */}
      <ResumeModal
        isOpen={!!selectedFile}
        onClose={handleCloseModal}
        resumeData={resumeData}
        fileName={
          selectedFile
            ? files.find((f) => f.id === selectedFile)?.fileName
            : undefined
        }
      />
    </div>
  );
}
