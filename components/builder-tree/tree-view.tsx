'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeNode } from './tree-node';

interface TreeViewProps {
  data: any;
}

export function TreeView({ data }: TreeViewProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <div className="space-y-2">
          {data.data.page.map((pageData: any, index: number) => (
            <TreeNode key={pageData.id || index} node={pageData} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}