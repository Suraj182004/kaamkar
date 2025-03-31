'use client';

import { cn } from "@/lib/utils";

interface FormattedContentProps {
  content: string;
  className?: string;
}

export function FormattedContent({ content, className }: FormattedContentProps) {
  return (
    <div 
      className={cn("formatted-content", className)}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
} 