'use client';

import React, { useState, useEffect } from 'react';
import { BuilderPage } from '@/lib/types';
import { ExternalLink, Save, Globe } from 'lucide-react';
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
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  filterTerm?: string;
  onBlocksUpdate?: (pageId: string, blocks: any[]) => void;
}

export function PageItem({ 
  page, 
  onTitleUpdate, 
  selectedNodeId, 
  onNodeSelect,
  filterTerm,
  onBlocksUpdate 
}: PageItemProps) {
  const [blocks, setBlocks] = useState(page.data.blocks || []);
  const [filteredBlocks, setFilteredBlocks] = useState(blocks);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const { toast } = useToast();

  // Update blocks when page data changes
  useEffect(() => {
    setBlocks(page.data.blocks || []);
  }, [page.data.blocks]);

  // Apply filter without notifying parent immediately
  useEffect(() => {
    if (filterTerm) {
      const filterBlocksRecursively = (blocks: any[]): any[] => {
        return blocks.filter(block => {
          const keepBlock = block.component?.name !== filterTerm;
          if (block.children) {
            block.children = filterBlocksRecursively(block.children);
          }
          if (block.blocks) {
            block.blocks = filterBlocksRecursively(block.blocks);
          }
          return keepBlock && (
            (block.children && block.children.length > 0) || 
            (block.blocks && block.blocks.length > 0) ||
            !block.children && !block.blocks
          );
        });
      };

      const filtered = filterBlocksRecursively([...blocks]);
      setFilteredBlocks(filtered);
    } else {
      setFilteredBlocks(blocks);
    }
  }, [filterTerm, blocks]);

  // Notify parent of block changes separately
  useEffect(() => {
    onBlocksUpdate?.(page.id, filteredBlocks);
  }, [filteredBlocks, page.id, onBlocksUpdate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const blocksToSave = filterTerm ? filteredBlocks : blocks;
      const response = await updatePageBlocks(page.id, blocksToSave, page.data);
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
    } catch (error) {
      console.error('Failed to update node:', error);
      toast({
        title: "Error",
        description: "Failed to update component",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    const filterNodes = (nodes: any[]): any[] => {
      return nodes.filter(node => {
        if (node.id === nodeId) return false;
        if (node.children) node.children = filterNodes(node.children);
        if (node.blocks) node.blocks = filterNodes(node.blocks);
        return true;
      });
    };

    const updatedBlocks = filterNodes([...blocks]);
    setBlocks(updatedBlocks);
  };

  return (
    <div className="group flex flex-col p-4 bg-card hover:bg-accent rounded-lg border transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PageStatus published={page.published} />
          <h2 className="font-medium group-hover:text-primary">
            {page.data.title} ({page.name}) - 
            <a
              href={`https://builder.io/content/${page.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:text-primary mx-1"
            >
              <Globe className="h-4 w-4" />
            </a>
            - {page.data.url}
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
            disabled={isSaving}
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

      {filteredBlocks?.length > 0 && (
        <div className="w-full">
          <TreeView 
            blocks={filteredBlocks}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            selectedNodeId={selectedNodeId}
            onNodeSelect={onNodeSelect}
            pageId={page.id}
            onBlocksUpdate={onBlocksUpdate}
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