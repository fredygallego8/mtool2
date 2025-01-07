'use client';

import { useState, useEffect } from 'react';
import { fetchBuilderPages } from '@/lib/api/builder';
import { BuilderPage } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { FileText } from 'lucide-react';
import { PageItem } from '@/components/page-item';

export function PageList() {
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      const data = await fetchBuilderPages();
      setPages(data.results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function handleTitleUpdate(pageId: string, newTitle: string) {
    setPages(pages.map(page => 
      page.id === pageId 
        ? { ...page, data: { ...page.data, title: newTitle } }
        : page
    ));
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Builder.io Pages</h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {pages.length} {pages.length === 1 ? 'page' : 'pages'}
        </span>
      </div>
      
      <div className="grid gap-4">
        {pages.map((page) => (
          <PageItem 
            key={page.id} 
            page={page} 
            onTitleUpdate={handleTitleUpdate}
          />
        ))}
      </div>
      
      {pages.length === 0 && (
        <p className="text-center text-muted-foreground">No pages found.</p>
      )}
    </div>
  );
}