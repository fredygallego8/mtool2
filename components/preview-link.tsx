'use client';

import { Eye } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PreviewLinkProps {
  previewUrl?: string;
}

export function PreviewLink({ previewUrl }: PreviewLinkProps) {
  if (!previewUrl) return null;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 hover:bg-accent rounded-md transition-colors"
        >
          <Eye className="h-4 w-4" />
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Preview page</p>
      </TooltipContent>
    </Tooltip>
  );
}