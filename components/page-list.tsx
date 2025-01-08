'use client';

import { useState, useEffect } from 'react';
import { fetchBuilderPages } from '@/lib/api/builder';
import { BuilderPage } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { FileText, Filter, Layers } from 'lucide-react';
import { PageItem } from '@/components/page-item';
import { Button } from '@/components/ui/button';
import { UrlFilterModal } from '@/components/url-filter-modal';
import { NodeFilterModal } from '@/components/node-filter-modal';
import { SaveAllPagesModal } from '@/components/save-all-pages-modal';
import { getStoredUrlFilters } from '@/lib/storage/filters';

export function PageList() {
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUrlFilterModalOpen, setUrlFilterModalOpen] = useState(false);
  const [isNodeFilterModalOpen, setNodeFilterModalOpen] = useState(false);
  const [filteredPages, setFilteredPages] = useState<BuilderPage[]>([]);
  const [isSaveAllModalOpen, setSaveAllModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [modifiedBlocks, setModifiedBlocks] = useState<Record<string, any[]>>({});

  useEffect(() => {
    loadPages();
  }, []);

  // Apply only URL filters when pages load
  useEffect(() => {
    if (pages.length > 0) {
      const storedUrls = getStoredUrlFilters();
      
      if (storedUrls.length > 0) {
        setFilteredPages(pages.filter(page => 
          storedUrls.some(url => page.data.url?.includes(url))
        ));
      } else {
        setFilteredPages(pages);
      }
    }
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
    if (urls.length === 0) {
      setFilteredPages(pages);
    } else {
      setFilteredPages(pages.filter(page => 
        urls.some(url => page.data.url?.includes(url))
      ));
    }
  }

  function handleNodeFilter(componentName: string) {
    setFilterTerm(componentName);
  }

  function handleBlocksUpdate(pageId: string, blocks: any[]) {
    setModifiedBlocks(prev => ({
      ...prev,
      [pageId]: blocks
    }));
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Builder.io Pages</h1>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUrlFilterModalOpen(true)}
              title="Filter by URLs"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNodeFilterModalOpen(true)}
              title="Filter by Component"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setSaveAllModalOpen(true)}>
            Save All Pages
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'}
          </span>
        </div>
      </div>
      
      <div className="grid gap-4">
        {filteredPages.map((page) => (
          <PageItem 
            key={page.id} 
            page={page} 
            onTitleUpdate={handleTitleUpdate}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
            filterTerm={filterTerm}
            onBlocksUpdate={handleBlocksUpdate}
          />
        ))}
      </div>
      
      {filteredPages.length === 0 && (
        <p className="text-center text-muted-foreground">No pages found.</p>
      )}

      <UrlFilterModal
        isOpen={isUrlFilterModalOpen}
        onClose={() => setUrlFilterModalOpen(false)}
        onFilter={handleUrlFilter}
      />

      <NodeFilterModal
        isOpen={isNodeFilterModalOpen}
        onClose={() => setNodeFilterModalOpen(false)}
        onFilter={handleNodeFilter}
      />

      <SaveAllPagesModal
        isOpen={isSaveAllModalOpen}
        onClose={() => setSaveAllModalOpen(false)}
        pages={filteredPages}
        modifiedBlocks={modifiedBlocks}
      />
    </div>
  );
}