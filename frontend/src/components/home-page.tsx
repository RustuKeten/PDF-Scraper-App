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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight px-2">
              AI-Powered PDF Resume
              <br className="hidden sm:block" />
              <span className="text-blue-600 dark:text-blue-400">Data Extractor</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto px-2">
              Extract structured data from your resumes and CVs instantly using
              advanced AI technology
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-card">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-card-foreground mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Extract structured resume data in three simple steps
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-blue-200 transition-all shadow-lg"
              >
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="bg-blue-100 rounded-full p-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features/Benefits Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Why Choose Our PDF Scraper?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              Built for developers and businesses who need reliable resume data
              extraction
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 bg-card p-3 sm:p-4 rounded-lg shadow-sm border border-border"
              >
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-card-foreground text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-xl">
          <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-8 text-center text-white">
            <Zap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Ready to Extract Resume Data?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100 px-2">
              Get started in seconds. No credit card required.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg font-semibold px-6 sm:px-8 py-5 sm:py-6 h-auto w-full sm:w-auto"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
