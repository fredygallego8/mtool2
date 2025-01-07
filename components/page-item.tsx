'use client';

import { useState } from 'react';
import { BuilderPage } from '@/lib/types';
import { ExternalLink, Save } from 'lucide-react';
import { EditTitle } from './edit-title';
import { PageStatus } from './page-status';
import { PreviewLink } from './preview-link';
import { TreeView } from './builder-tree/tree-view';
import { useToast } from '@/hooks/use-toast';
import { updatePageBlocks } from '@/lib/api/builder';
import { Button } from './ui/button';
import { SavePageModal } from './save-page-modal';

interface PageItemProps {
  page: BuilderPage;
  onTitleUpdate: (id: string, title: string) => void;
}

export function PageItem({ page, onTitleUpdate }: PageItemProps) {
  const [blocks, setBlocks] = useState(page.data.blocks || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!blocks.length) {
      toast({
        title: "Error",
        description: "Cannot save empty blocks",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await updatePageBlocks(page.id, blocks, page.data);
      setApiResponse(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNode = async (nodeId: string, newData: any) => {
    try {
      if (newData === null) {
        // Handle node deletion
        const filterNodes = (nodes: any[]): any[] => {
          return nodes.filter(block => {
            if (block.id === nodeId) return false;
            if (block.children?.length > 0) {
              const filteredChildren = filterNodes(block.children);
              block.children = filteredChildren.length > 0 ? filteredChildren : undefined;
            }
            if (block.blocks?.length > 0) {
              const filteredBlocks = filterNodes(block.blocks);
              block.blocks = filteredBlocks.length > 0 ? filteredBlocks : undefined;
            }
            return true;
          });
        };

        const updatedBlocks = filterNodes([...blocks]);
        setBlocks(updatedBlocks);
      } else {
        // Handle node update
        const updateBlocksRecursively = (nodes: any[]): any[] => {
          return nodes.map(block => {
            if (block.id === nodeId) {
              return newData;
            }
            if (block.children?.length > 0) {
              return {
                ...block,
                children: updateBlocksRecursively(block.children)
              };
            }
            if (block.blocks?.length > 0) {
              return {
                ...block,
                blocks: updateBlocksRecursively(block.blocks)
              };
            }
            return block;
          });
        };

        const updatedBlocks = updateBlocksRecursively([...blocks]);
        setBlocks(updatedBlocks);
      }
    } catch (error) {
      console.error('Failed to update node:', error);
      toast({
        title: "Error",
        description: "Failed to update component",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="group flex flex-col p-4 bg-card hover:bg-accent rounded-lg border transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PageStatus published={page.published} />
          <h2 className="font-medium group-hover:text-primary">
            {page.data.title} ({page.name}) - {page.id} - {page.data.url}
          </h2>
          <EditTitle
            id={page.id}
            initialTitle={page.data.title}
            onUpdate={(newTitle) => onTitleUpdate(page.id, newTitle)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={isSaving || !blocks.length}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Page
          </Button>
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

      {blocks?.length > 0 && (
        <div className="w-full">
          <TreeView 
            blocks={blocks}
            onUpdateNode={handleUpdateNode}
          />
        </div>
      )}

      <SavePageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        apiResponse={apiResponse}
        isSaving={isSaving}
      />
    </div>
  );
}