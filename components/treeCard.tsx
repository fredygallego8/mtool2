'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, ScrollArea } from '@nextui-org/react'; // Or your UI library
import { Folder, FileText, Database, Cube, PuzzlePiece } from 'lucide-react'; // Import icons


interface TreeNode {
  id: string;
  type: 'component' | 'child';
  name: string;
  children?: TreeNode[];
  index?: number; // Added to keep track of the original index for deletion
}

interface TreeCardProps {
  blocks: Array<{ component?: { name: string }; children?: Array<{ layerName: string }> }>;
  onDelete?: (index: number) => void;
}


const TreeCard: React.FC<TreeCardProps> = ({ blocks, onDelete }) => {
  const [nodesToDelete, setNodesToDelete] = useState<number[]>([]);

  const transformBlocks = (): TreeNode[] => {
    return blocks.map((block, index) => ({
      id: `block-${index}`,  // Create unique IDs
      type: 'component',
      name: block.component?.name || 'Unknown Component',
      index: index, // Store the original index
      children: block.children?.map((child, childIndex) => ({
        id: `child-${index}-${childIndex}`, // Create unique IDs for children
        type: 'child',
        name: child.layerName || 'Unknown Layer',

      })),
    }));
  };

  const renderNode = (node: TreeNode) => {
    const icon = node.type === 'component' ? <Cube className="h-4 w-4 text-purple-500" /> : <PuzzlePiece className="h-4 w-4 text-indigo-500" />;


  return (
    <div key={node.id} className="mb-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className={` ${nodesToDelete.includes(node.index!) ? 'text-red-500 bg-red-100 rounded-sm px-1' : ''}`}>
          {node.name}
        </span>
            {onDelete && node.index !== undefined && (
              <button
                onClick={() => {
                  setNodesToDelete(prev => [...prev, node.index!]);
                  onDelete(node.index!);
                }}
                aria-label="Delete component"
              >
                <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
              </button>
            )}
          </div>
          {node.children && (
             <div className="ml-6">
               {node.children.map(renderNode)}
            </div>
          )}
        </div>
    );
  };



  return (
        <Card className="w-full max-w-md"> {/* Adjust width as needed */}
          <CardContent className="p-4">
            <ScrollArea className="h-[400px] pr-4"> {/* Adjust height as needed */}
              <div className="tree-view">
                {transformBlocks().map(renderNode)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
  );
};

export default TreeCard;
