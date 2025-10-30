"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Brain,
  FileText,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/signin");
  };

  const features = [
    {
      icon: Upload,
      title: "Upload PDF",
      description:
        "Simply upload your resume or CV in PDF format. We support files up to 10MB.",
    },
    {
      icon: Brain,
      title: "AI Processing",
      description:
        "Our advanced AI analyzes and extracts structured data from your document.",
    },
    {
      icon: FileText,
      title: "Get JSON Data",
      description:
        "Receive clean, structured JSON data ready for use in your applications.",
    },
  ];

  const benefits = [
    "Fast and accurate extraction",
    "Handles text-based PDFs",
    "Secure and private processing",
    "Complete upload history",
    "Credit-based system",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              AI-Powered PDF Resume
              <br />
              <span className="text-blue-600">Data Extractor</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Extract structured data from your resumes and CVs instantly using
              advanced AI technology
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract structured resume data in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-blue-200 transition-all shadow-lg"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-blue-100 rounded-full p-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features/Benefits Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our PDF Scraper?
            </h2>
            <p className="text-lg text-gray-600">
              Built for developers and businesses who need reliable resume data
              extraction
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm"
              >
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-xl">
          <CardContent className="pt-12 pb-12 px-8 text-center text-white">
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Extract Resume Data?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Get started in seconds. No credit card required.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold px-8 py-6 h-auto"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
