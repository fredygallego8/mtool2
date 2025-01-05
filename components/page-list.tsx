'use client';

import { useState, useEffect } from 'react';
import { fetchBuilderPages } from '@/lib/api/builder';
import { BuilderPage } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { FileText } from 'lucide-react';
import { PageItem } from '@/components/page-item';
import { BUILDER_CONFIG } from '@/lib/config/builder';
import { ConfigModal } from '@/components/configModal';
import { FiSettings } from 'react-icons/fi';
import { getStoredConfig } from '../lib/config/storage';

export function PageList() {
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(BUILDER_CONFIG);

  const handleSaveConfig = (newConfig: typeof BUILDER_CONFIG) => {
    setConfig(newConfig);

    // Here you can implement the logic to save the configuration
    console.log('New config:', newConfig);
/*     window.location.reload();
 */
  };

  useEffect(() => {
  
    const storedConfig = getStoredConfig();
    if (storedConfig) {
      setConfig(storedConfig);
    }    
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
      <button
        onClick={() => setIsConfigOpen(true)}
        className="fixed top-4 right-4 p-2 rounded-full hover:bg-gray-100"
      >
        <FiSettings size={24} />
      </button>      
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
      />      
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-primary">{config?.TITLE? config?.TITLE:""}</h1>
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