'use client';

import { useState, useEffect } from 'react';
import { fetchBuilderPages } from '@/lib/api/builder';
import { BuilderPage } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { FileText, Filter } from 'lucide-react';
import { PageItem } from '@/components/page-item';
import { Button } from '@/components/ui/button';
import { UrlFilterModal } from '@/components/url-filter-modal';
import { useToast } from '@/hooks/use-toast';

export function PageList() {
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    setFilteredPages(pages);
  }, [pages]);

  async function loadPages() {
    try {
      const data = await fetchBuilderPages();
      setPages(data.results);
      setFilteredPages(data.results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function handleTitleUpdate(pageId: string, newTitle: string) {
    const updatePages = (pageList: BuilderPage[]) =>
      pageList.map(page =>
        page.id === pageId
          ? { ...page, data: { ...page.data, title: newTitle } }
          : page
      );

    setPages(updatePages);
    setFilteredPages(updatePages);
  }

  function handleUrlFilter(urls: string[]) {
    if (!urls.length) {
      setFilteredPages(pages);
      return;
    }

    const filtered = pages.filter(page => 
      urls.some(url => page.data.url === url)
    );
    setFilteredPages(filtered);

    toast({
      title: "Filter Applied",
      description: `Showing ${filtered.length} matching pages`,
    });
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Builder.io Pages</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFilterModalOpen(true)}
            className="ml-2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'}
        </span>
      </div>
      
      <div className="grid gap-4">
        {filteredPages.map((page) => (
          <PageItem 
            key={page.id} 
            page={page} 
            onTitleUpdate={handleTitleUpdate}
          />
        ))}
      </div>
      
      {filteredPages.length === 0 && (
        <p className="text-center text-muted-foreground">No pages found.</p>
      )}

      <UrlFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilter={handleUrlFilter}
      />
    </div>
  );
}