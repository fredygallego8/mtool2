'use client';

import { Globe } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PageStatusProps {
  published: string;
}

export function PageStatus({ published }: PageStatusProps) {
  const isPublished = published === 'published';
  
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={`p-1 rounded-full ${isPublished ? 'text-red-500' : 'text-gray-400'}`}>
          <Globe className="h-4 w-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isPublished ? 'Published' : 'Draft'}</p>
      </TooltipContent>
    </Tooltip>
  );
}