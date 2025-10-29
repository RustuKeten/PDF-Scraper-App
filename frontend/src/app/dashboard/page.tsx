"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { Navigation } from "@/components/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, Upload, CreditCard, Crown, Zap } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [filesProcessed, setFilesProcessed] = useState(0);
  const [creditsRemaining, setCreditsRemaining] = useState(1000);
  const [planType, setPlanType] = useState("FREE");

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      // TODO: Implement file upload logic
      console.log("Selected file:", file);
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="dashboard" />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-gray-600">
              Upload your PDF files to extract structured data using AI
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-gray-900">Upload PDF File</span>
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Upload a PDF file up to 10MB to extract structured resume data
                  using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                  maxSize={10}
                />
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Files Processed
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {filesProcessed}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Credits Remaining
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {creditsRemaining.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {planType === "FREE" ? (
                      <Zap className="h-6 w-6 text-purple-600" />
                    ) : (
                      <Crown className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Current Plan
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {planType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Files Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-gray-900">Recent Files</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your recently uploaded and processed PDF files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No files uploaded yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your first PDF file to see it appear here
                </p>
                <Button
                  onClick={() =>
                    document.querySelector('input[type="file"]')?.click()
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
