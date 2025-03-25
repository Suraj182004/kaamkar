import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex h-[500px] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
} 