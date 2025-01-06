'use client';

interface BlockListProps {
  blocks?: Array<{ component: { name: string } }>;
}

export function BlockList({ blocks = [] }: BlockListProps) {
  if (!blocks.length) return null;
  
  return (
    <div className="mt-2 space-y-1">
      <p className="text-sm font-medium text-muted-foreground">Components:</p>
      <ul className="text-sm space-y-1 ml-4">
        {blocks.map((block, index) => (
          <li key={index} className="text-muted-foreground">
            • {block.component.name}
          </li>
        ))}
      </ul>
    </div>
  );
}