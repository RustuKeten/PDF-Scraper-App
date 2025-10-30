"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FileText,
  Settings,
  LogOut,
  User,
  Brain,
  ArrowRight,
} from "lucide-react";

interface NavigationProps {
  currentPage?: string;
  showPublicNav?: boolean;
}

export function Navigation({
  currentPage,
  showPublicNav = false,
}: NavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleTryItNow = () => {
    router.push("/auth/signin");
  };

  // Public navigation (for home page)
  if (showPublicNav || !session) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FileText className="h-8 w-8 text-blue-400" />
                <Brain className="h-4 w-4 text-purple-400 absolute -top-1 -right-1" />
              </div>
              <h1
                className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"
                onClick={() => router.push("/")}
              >
                PDF Scraper
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={handleTryItNow}
                size="sm"
                className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black text-sm font-semibold px-4"
              >
                Try It Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated navigation (dashboard)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FileText className="h-8 w-8 text-blue-400" />
                <Brain className="h-4 w-4 text-purple-400 absolute -top-1 -right-1" />
              </div>
              <h1
                className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                PDF Scraper
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant={currentPage === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => (window.location.href = "/dashboard")}
                className={
                  currentPage === "dashboard"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              >
                Dashboard
              </Button>
              <Button
                variant={currentPage === "settings" ? "default" : "ghost"}
                size="sm"
                onClick={() => (window.location.href = "/settings")}
                className={
                  currentPage === "settings"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user?.name || session.user?.email}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-900 text-purple-300 border-purple-700">
                    FREE
                  </Badge>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    1000 credits
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                <User className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </div>
            </div>

            <ThemeToggle />

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
