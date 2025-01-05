'use client';

interface BlockListProps {
  blocks?: Array<{ component?: { name: string }; children?: Array<{ layerName: string }> }>;
}

export function BlockList({ blocks = [] }: BlockListProps) {
  if (!blocks.length) return null;

  return (
    <div className="mt-2 space-y-1">
      {blocks.some(block => block.component?.name) && ( // Conditional rendering of the entire component list section
        <>
          <p className="text-sm font-medium text-muted-foreground">Components:</p>
          <ul className="text-sm space-y-1 ml-4">
            {blocks.map((block, index) => (
              block.component?.name && ( // Conditionally render each list item
                <li key={index} className="text-muted-foreground">
                  • {block.component?.name}
                  {block.children && block.children.length > 0 && (
                    <ul className="ml-4">
                      {block.children.map((child, childIndex) => (
                        <li key={childIndex} className="text-muted-foreground">
                          • {child?.layerName || 'Unknown layerName'}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

