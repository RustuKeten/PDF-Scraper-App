import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0">
          <p className="text-xs sm:text-sm text-muted-foreground text-center flex items-center gap-1.5">
            © Copyright{" "}
            <a
              href="https://github.com/RustuKeten"
              className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline flex items-center gap-1"
            >
              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              RustuKeten
            </a>{" "}
            2025
          </p>
        </div>
      </div>
    </footer>
  );
}
