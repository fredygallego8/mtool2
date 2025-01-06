'use client';

import { ChevronRight, ChevronDown, Layout, Image as ImageIcon, Type, Columns, Code, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CodeModal } from './code-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  node: any;
  level?: number;
  onUpdate?: (nodeId: string, newData: any) => Promise<void>;
  onDelete?: (nodeId: string) => void;
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export function TreeNode({ 
  node, 
  level = 0, 
  onUpdate, 
  onDelete,
  selectedNodeId,
  onNodeSelect 
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasChildren = node.children?.length > 0 || node.blocks?.length > 0;
  const children = node.children || node.blocks || [];

  const tagName = node.tagName === "img" ? "Image" : node.tagName;
  const name = node.component?.name === "Core:Section" ? "Section" : node.component?.name ||  node.layerName || node.name || tagName || 'Box';
  const displayName = node.layerName || name || node.name || tagName || 'Unnamed Component';

  const isTextComponent = displayName === 'Text';
  const textContent = isTextComponent ? node.component?.options?.text?.replace(/<[^>]*>/g, '') : null;
  const isSelected = selectedNodeId === node.id;

  const getIcon = (displayName: string) => {
    switch (displayName) {
      case 'Box':
      case 'Core:Section':
      case 'Section':
        return <Layout className="h-4 w-4 text-blue-500" />;        
      case 'Image':
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case 'Text':
        return <Type className="h-4 w-4 text-purple-500" />;
      case 'Columns':
        return <Columns className="h-4 w-4 text-orange-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            className={cn(
              "flex items-center gap-1 px-2 py-1 cursor-pointer rounded-md transition-colors group/item",
              isSelected && "bg-primary/10 hover:bg-primary/20",
              isHovered && !isSelected && "bg-accent",
              !isHovered && !isSelected && "hover:bg-accent"
            )}
            style={{ paddingLeft: `${level * 16}px` }}
            onClick={(e) => {
              e.stopPropagation();
              if (onNodeSelect) {
                onNodeSelect(node.id);
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center flex-1">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-4 w-4 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              {getIcon(displayName)}
              
              <div className="flex flex-col ml-2">
                <span className="text-sm">
                  {displayName}
                </span>
                {textContent && (
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {textContent}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCodeModalOpen(true);
                }}
              >
                <Code className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(node.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsCodeModalOpen(true)}>
            <Code className="mr-2 h-4 w-4" />
            Edit JSON
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDelete?.(node.id)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        code={JSON.stringify(node, null, 2)}
        title={`Edit ${displayName}`}
        onSave={(newCode) => onUpdate?.(node.id, JSON.parse(newCode))}
      />

      {isExpanded && hasChildren && (
        <div className="w-full">
          {children.map((child: any) => (
            <TreeNode 
              key={child.id || `${node.id}-${Math.random()}`}
              node={child}
              level={level + 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}