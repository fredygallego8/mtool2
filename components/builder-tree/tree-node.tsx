'use client';

import { ChevronRight, ChevronDown, Layout, Image as ImageIcon, Type, Columns, Link, Code, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface TreeNodeProps {
  node: any;
  level?: number;
}

export function TreeNode({ node, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  
  const getIcon = (displayName: string) => {
    switch (displayName) {
      case 'Core:Section':
        return <Layout className="h-4 w-4 text-blue-500" />;
      case 'Section':
        return <Layout className="h-4 w-4 text-blue-500" />;        
      case 'Image':
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case 'Text':
        return <Type className="h-4 w-4 text-purple-500" />;
      case 'Columns':
        return <Columns className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const handleShowCode = () => {
    console.log('Show code for:', node);
  };

  const handleDelete = () => {
    setIsDeleted(true);
  };

  const handleDeleteInAllPages = () => {
    console.log('Delete in all pages:', node);
    setIsDeleted(true);
  };

  const hasChildren = node.children?.length > 0 || node.blocks?.length > 0;
  const children = node.children || node.blocks || [];
  const tagName = node.tagName === "img" ? "Image" : node.tagName;
  const name = node.component?.name === "Core:Section" ? "Section" : node.component?.name ||  node.layerName || node.name || tagName || 'Box' ;

  const displayName = node.layerName || name || node.name || tagName || 'Unnamed Component';

  return (
    <div className={`w-full ${isDeleted ? 'bg-red-100' : ''}`}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            className="flex items-center gap-1 hover:bg-accent rounded-md px-2 py-1 cursor-pointer"
            style={{ paddingLeft: `${level * 16}px` }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {hasChildren && (
              <button className="p-1 hover:bg-accent rounded-md">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            
            {getIcon(displayName)}
            
            <span className="text-sm">
              {displayName}
            </span>
            
            {node.linkUrl && (
              <Link className="h-3 w-3 text-blue-500 ml-1" />
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleShowCode}>
            <Code className="mr-2 h-4 w-4" />
            Show Code
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDeleteInAllPages}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete in All Pages
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && hasChildren && (
        <div className="w-full">
          {children.map((child: any, index: number) => (
            <TreeNode 
              key={child.id || index} 
              node={child} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}