'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeNode } from './tree-node';
import { JsonPreview } from './json-preview';

interface TreeViewProps {
  blocks: any[];
  onUpdateNode?: (nodeId: string, newData: any) => Promise<void>;
  onDeleteNode?: (nodeId: string) => void;
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
  pageId?: string;
  onBlocksUpdate?: (pageId: string, blocks: any[]) => void;
}

export function TreeView({ 
  blocks: initialBlocks, 
  onUpdateNode, 
  onDeleteNode,
  selectedNodeId,
  onNodeSelect,
  pageId,
  onBlocksUpdate
}: TreeViewProps) {
  const [localBlocks, setLocalBlocks] = useState(initialBlocks);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    setLocalBlocks(initialBlocks);
  }, [initialBlocks]);

  useEffect(() => {
    if (selectedNodeId) {
      const node = findNodeById(localBlocks, selectedNodeId);
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  }, [selectedNodeId, localBlocks]);

  const handleNodeSelect = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  };

  const handleJsonUpdate = async (newData: any) => {
    if (!selectedNodeId || !onUpdateNode) return;
    
    try {
      await onUpdateNode(selectedNodeId, newData);
      // Update local blocks to reflect changes
      const updatedBlocks = updateBlocksWithNewData(localBlocks, selectedNodeId, newData);
      setLocalBlocks(updatedBlocks);
      // Notify parent about blocks update
      if (pageId && onBlocksUpdate) {
        onBlocksUpdate(pageId, updatedBlocks);
      }
    } catch (error) {
      console.error('Failed to update JSON:', error);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!onDeleteNode) return;
    
    onDeleteNode(nodeId);
    // Update local blocks after deletion
    const updatedBlocks = deleteNodeFromBlocks(localBlocks, nodeId);
    setLocalBlocks(updatedBlocks);
    // Notify parent about blocks update
    if (pageId && onBlocksUpdate) {
      onBlocksUpdate(pageId, updatedBlocks);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[50vh]">
      <Card className="w-full h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Component Tree</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(50vh-80px)] overflow-auto">
          <div className="space-y-2">
            {localBlocks.map((block: any) => (
              <TreeNode 
                key={block.id || `${block.component?.name}-${Math.random()}`}
                node={block}
                onUpdate={handleJsonUpdate}
                onDelete={handleDeleteNode}
                selectedNodeId={selectedNodeId}
                onNodeSelect={handleNodeSelect}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <JsonPreview 
        data={selectedNode || localBlocks} 
        onUpdate={handleJsonUpdate}
        pageId={pageId}
        onBlocksUpdate={onBlocksUpdate}
      />
    </div>
  );
}

function findNodeById(blocks: any[], id: string): any {
  for (const block of blocks) {
    if (block.id === id) return block;
    
    if (block.children?.length) {
      const found = findNodeById(block.children, id);
      if (found) return found;
    }
    
    if (block.blocks?.length) {
      const found = findNodeById(block.blocks, id);
      if (found) return found;
    }
  }
  return null;
}

function updateBlocksWithNewData(blocks: any[], id: string, newData: any): any[] {
  return blocks.map(block => {
    if (block.id === id) {
      return newData;
    }
    
    if (block.children?.length) {
      return {
        ...block,
        children: updateBlocksWithNewData(block.children, id, newData)
      };
    }
    
    if (block.blocks?.length) {
      return {
        ...block,
        blocks: updateBlocksWithNewData(block.blocks, id, newData)
      };
    }
    
    return block;
  });
}

function deleteNodeFromBlocks(blocks: any[], id: string): any[] {
  return blocks.filter(block => {
    if (block.id === id) return false;
    
    if (block.children?.length) {
      block.children = deleteNodeFromBlocks(block.children, id);
    }
    if (block.blocks?.length) {
      block.blocks = deleteNodeFromBlocks(block.blocks, id);
    }
    
    return true;
  });
}