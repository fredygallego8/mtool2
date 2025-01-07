'use client';

import { useState, useEffect } from 'react';
import { fetchBuilderPages, updatePageBlocks } from '@/lib/api/builder';
import { BuilderPage } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { FileText, Search, Save, Filter } from 'lucide-react';
import { PageItem } from '@/components/page-item';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SaveAllPagesModal } from './save-all-pages-modal';
import { UrlFilterModal } from './url-filter-modal';
import { useToast } from '@/hooks/use-toast';

export function PageList() {
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [isSaveAllModalOpen, setSaveAllModalOpen] = useState(false);
  const [isUrlFilterModalOpen, setUrlFilterModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

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
      urls.some(url => url === page.data.url)
    );
    setFilteredPages(filtered);

    toast({
      title: "Filter Applied",
      description: `Showing ${filtered.length} matching pages`,
    });
  }

  function handleSearch(term: string) {
    setSearchTerm(term);
    let count = 0;
    filteredPages.forEach(page => {
      const countNodesWithName = (blocks: any[]): number => {
        return blocks.reduce((acc, block) => {
          if (block.component?.name === term) acc++;
          if (block.children?.length) acc += countNodesWithName(block.children);
          if (block.blocks?.length) acc += countNodesWithName(block.blocks);
          return acc;
        }, 0);
      };
      count += countNodesWithName(page.data.blocks || []);
    });
    setMatchCount(count);
  }

  const handleSavePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    try {
      await updatePageBlocks(pageId, page.data.blocks || [], page.data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save page: ${page.data.title}`,
        variant: "destructive",
      });
      throw error;
    }
  };

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
            onClick={() => setUrlFilterModalOpen(true)}
            className="ml-2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            onClick={() => setSaveAllModalOpen(true)}
          >
            <Save className="h-4 w-4 mr-2" />
            Save All Pages
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Node Filter</h2>
        <div className="relative flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="Enter component name..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {searchTerm && (
          <span className="text-sm text-muted-foreground">
            Found {matchCount} {matchCount === 1 ? 'match' : 'matches'}
          </span>
        )}
      </div>
      
      <div className="grid gap-4">
        {filteredPages.map((page) => (
          <PageItem 
            key={page.id} 
            page={page} 
            onTitleUpdate={handleTitleUpdate}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
            filterTerm={searchTerm}
          />
        ))}
      </div>
      
      {filteredPages.length === 0 && (
        <p className="text-center text-muted-foreground">No pages found.</p>
      )}

      <SaveAllPagesModal
        isOpen={isSaveAllModalOpen}
        onClose={() => setSaveAllModalOpen(false)}
        pages={filteredPages}
        onSave={handleSavePage}
      />

      <UrlFilterModal
        isOpen={isUrlFilterModalOpen}
        onClose={() => setUrlFilterModalOpen(false)}
        onFilter={handleUrlFilter}
      />
    </div>
  );
}