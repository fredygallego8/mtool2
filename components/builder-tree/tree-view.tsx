'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeNode } from './tree-node';

interface TreeViewProps {
  blocks: any;
}

export function TreeView({ blocks }: TreeViewProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-5">
        <div className="space-y-2">
          {blocks.map((pageData: any, index: number) => (
            <TreeNode key={pageData.id || index} node={pageData} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}