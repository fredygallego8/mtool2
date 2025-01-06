'use client';

import { BuilderPage } from '@/lib/types';
import { ExternalLink } from 'lucide-react';
import { EditTitle } from './edit-title';
import { PageStatus } from './page-status';
import { PreviewLink } from './preview-link';
import { TreeView } from './builder-tree/tree-view';

interface PageItemProps {
  page: BuilderPage;
  onTitleUpdate: (pageId: string, newTitle: string) => void;
}

export function PageItem({ page, onTitleUpdate }: PageItemProps) {
  const treeData = {
    data: {
      page: [{
        ...page.data,
        id: page.id,
        name: page.data.title
      }]
    }
  };

  return (
    <div className="group flex flex-col p-4 bg-card hover:bg-accent rounded-lg border transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PageStatus published={page.published} />
          <h2 className="font-medium group-hover:text-primary">
            {page.data.title}
          </h2>
          <EditTitle
            id={page.id}
            initialTitle={page.data.title}
            onUpdate={(newTitle) => onTitleUpdate(page.id, newTitle)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <PreviewLink previewUrl={page.meta?.lastPreviewUrl} />
          <a
            href={page.data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
      </p>

      {page.data.blocks?.length > 0 && (
        <TreeView data={treeData} />
      )}
    </div>
  );
}