'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Code } from "lucide-react";
import { CodeModal } from './builder-tree/code-modal';
import { updatePageBlocks } from '@/lib/api/builder';

interface PageSaveStatus {
  pageId: string;
  title: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
  blocks?: any[];
  response?: any;
}

interface SaveAllPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Array<{ id: string; data: { title: string; blocks: any[] } }>;
  modifiedBlocks: Record<string, any[]>;
}

export function SaveAllPagesModal({ isOpen, onClose, pages, modifiedBlocks }: SaveAllPagesModalProps) {
  const [saveStatuses, setSaveStatuses] = useState<PageSaveStatus[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedJson, setSelectedJson] = useState<{ title: string; data: any } | null>(null);

  const startSaving = async () => {
    setIsSaving(true);
    // Initialize statuses with blocks that will be saved
    const initialStatuses = pages.map(page => ({
      pageId: page.id,
      title: page.data.title,
      status: 'pending' as const,
      blocks: modifiedBlocks[page.id] || page.data.blocks
    }));
    setSaveStatuses(initialStatuses);

    for (const status of initialStatuses) {
      try {
        const page = pages.find(p => p.id === status.pageId)!;
        const blocksToSave = status.blocks || page.data.blocks;
        
        const response = await updatePageBlocks(status.pageId, blocksToSave, page.data);
        setSaveStatuses(prev => 
          prev.map(s => 
            s.pageId === status.pageId 
              ? { ...s, status: 'success', response }
              : s
          )
        );
      } catch (error) {
        setSaveStatuses(prev => 
          prev.map(s => 
            s.pageId === status.pageId 
              ? { ...s, status: 'error', error: error instanceof Error ? error.message : 'Failed to save' }
              : s
          )
        );
      }
    }
    setIsSaving(false);
  };

  const getStatusIcon = (status: PageSaveStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const viewBlocks = (status: PageSaveStatus) => {
    setSelectedJson({
      title: `Blocks to Save - ${status.title}`,
      data: status.blocks || []
    });
  };

  const viewResponse = (status: PageSaveStatus) => {
    setSelectedJson({
      title: `API Response - ${status.title}`,
      data: status.response
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Save All Pages</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4 overflow-auto max-h-[50vh]">
            {saveStatuses.map((status) => (
              <div 
                key={status.pageId}
                className={`flex items-center justify-between p-3 rounded-md ${
                  status.status === 'error' ? 'bg-red-50' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span className="font-medium">{status.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {status.error && (
                    <span className="text-sm text-red-600">{status.error}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => viewBlocks(status)}
                    title="View blocks to be saved"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  {status.response && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => viewResponse(status)}
                      title="View API response"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            {!isSaving && saveStatuses.length === 0 && (
              <Button onClick={startSaving}>
                Start Saving
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              {isSaving ? 'Cancel' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedJson && (
        <CodeModal
          isOpen={true}
          onClose={() => setSelectedJson(null)}
          code={JSON.stringify(selectedJson.data, null, 2)}
          title={selectedJson.title}
        />
      )}
    </>
  );
}