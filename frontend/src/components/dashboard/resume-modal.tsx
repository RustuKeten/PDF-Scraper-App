"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";

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
  if (!isOpen) return null;

  const renderResumeData = (data: any) => {
    if (!data) return <div className="text-gray-500">No data available</div>;

    // Handle mock data structure
    if (data.rawText) {
      return (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Raw PDF Text:</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {data.rawText}
            </pre>
          </div>
          {data.note && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">{data.note}</p>
            </div>
          )}
        </div>
      );
    }

    // Handle structured resume data
    return (
      <div className="space-y-6">
        {/* Profile Section */}
        {data.profile && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                👤 Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Name:
                  </span>
                  <p className="text-gray-900">
                    {data.profile.name} {data.profile.surname}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Email:
                  </span>
                  <p className="text-gray-900">{data.profile.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Headline:
                  </span>
                  <p className="text-gray-900">{data.profile.headline}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Location:
                  </span>
                  <p className="text-gray-900">
                    {data.profile.city}, {data.profile.country}
                  </p>
                </div>
              </div>
              {data.profile.professionalSummary && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Summary:
                  </span>
                  <p className="text-gray-900 mt-1">
                    {data.profile.professionalSummary}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Work Experience */}
        {data.workExperiences && data.workExperiences.length > 0 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                💼 Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.workExperiences.map((exp: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-semibold text-gray-900">
                    {exp.jobTitle}
                  </h4>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {exp.startMonth}/{exp.startYear} -{" "}
                    {exp.current ? "Present" : `${exp.endMonth}/${exp.endYear}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {exp.locationType} • {exp.employmentType}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {data.educations && data.educations.length > 0 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                🎓 Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.educations.map((edu: any, index: number) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <h4 className="font-semibold text-gray-900">{edu.school}</h4>
                  <p className="text-gray-700">
                    {edu.degree} in {edu.major}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.startYear} - {edu.current ? "Present" : edu.endYear}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">🛠️ Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderResumeData(resumeData)}
        </CardContent>
      </Card>
    </div>
  );
}
