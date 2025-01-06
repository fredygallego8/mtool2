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
    setIsSaving(true);
    try {
      const response = await updatePageBlocks(page.id, blocks);
      setApiResponse(response);
      toast({
        title: "Success",
        description: "Page saved successfully",
      });
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
      const updateBlocksRecursively = (blocks: any[]): any[] => {
        return blocks.map(block => {
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
      
      toast({
        title: "Success",
        description: "Block updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update block",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="group flex flex-col p-4 bg-card hover:bg-accent rounded-lg border transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PageStatus published={page.published} />
          <h2 className="font-medium group-hover:text-primary">
            {page.data.title} ({page.name}) - {page.id}- {page.data.url}
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
            className="gap-2"
          >
            <Save className="h-4 w-4" />
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
        <TreeView 
          blocks={blocks}
          onUpdateNode={handleUpdateNode}
        />
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