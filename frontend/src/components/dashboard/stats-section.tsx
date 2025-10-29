"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Wallet, Shield, Activity } from "lucide-react";

interface StatsSectionProps {
  filesCount: number;
  creditsRemaining: number;
  planType: string;
}

export function StatsSection({
  filesCount,
  creditsRemaining,
  planType,
}: StatsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">
          Dashboard Overview
        </h2>
        <p className="text-black">
          Track your PDF processing activity and account status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Files Processed */}
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Files Processed
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filesCount}</div>
            <p className="text-xs text-gray-400">Total PDFs uploaded</p>
          </CardContent>
        </Card>

        {/* Credits Remaining */}
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Credits Remaining
            </CardTitle>
            <Wallet className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {creditsRemaining.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">Available for processing</p>
          </CardContent>
        </Card>

        {/* Plan Type */}
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Current Plan
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{planType}</div>
            <p className="text-xs text-gray-400">Subscription level</p>
          </CardContent>
        </Card>

        {/* Processing Status */}
        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Status
            </CardTitle>
            <Activity className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Active</div>
            <p className="text-xs text-gray-400">Ready to process</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
