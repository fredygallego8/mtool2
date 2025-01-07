'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeNode } from './tree-node';
import { JsonPreview } from './json-preview';

interface TreeViewProps {
  blocks: any[];
  onUpdateNode?: (nodeId: string, newData: any) => Promise<void>;
  onDeleteNode?: (nodeId: string) => void;
}

export function TreeView({ blocks, onUpdateNode, onDeleteNode }: TreeViewProps) {
  const [localBlocks, setLocalBlocks] = useState(blocks);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

  // Update local blocks when props change
  useEffect(() => {
    setLocalBlocks(blocks);
  }, [blocks]);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (onDeleteNode) {
      onDeleteNode(nodeId);
    }
    setSelectedNodeId(undefined);
  };

  const selectedNode = selectedNodeId ? 
    findNodeById(localBlocks, selectedNodeId) : 
    null;

  const handleJsonUpdate = async (newData: any) => {
    if (!selectedNodeId || !onUpdateNode) return;
    
    try {
      await onUpdateNode(selectedNodeId, newData);
    } catch (error) {
      console.error('Failed to update JSON:', error);
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
                onUpdate={onUpdateNode}
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