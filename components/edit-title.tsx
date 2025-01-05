'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { updatePageTitle } from '@/lib/api/builder';

interface EditTitleProps {
  id: string;
  initialTitle: string;
  onUpdate: (newTitle: string) => void;
}

export function EditTitle({ id, initialTitle, onUpdate }: EditTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    if (title === initialTitle) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updatePageTitle(id, title);
      onUpdate(title);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update title:', error);
      setTitle(initialTitle);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setTitle(initialTitle);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 hover:bg-accent rounded-md transition-colors"
        aria-label="Edit title"
      >
        <Pencil className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={isLoading}
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="p-1 hover:bg-accent rounded-md transition-colors"
        aria-label="Save title"
      >
        <Check className="h-4 w-4 text-green-600" />
      </button>
      <button
        onClick={handleCancel}
        disabled={isLoading}
        className="p-1 hover:bg-accent rounded-md transition-colors"
        aria-label="Cancel editing"
      >
        <X className="h-4 w-4 text-red-600" />
      </button>
    </div>
  );
}