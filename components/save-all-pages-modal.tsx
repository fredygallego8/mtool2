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

interface PageSaveStatus {
  pageId: string;
  title: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
  response?: any;
}

interface SaveAllPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Array<{ id: string; data: { title: string } }>;
  onSave: (pageId: string) => Promise<void>;
}

export function SaveAllPagesModal({ isOpen, onClose, pages, onSave }: SaveAllPagesModalProps) {
  const [saveStatuses, setSaveStatuses] = useState<PageSaveStatus[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<{ title: string; data: any } | null>(null);

  const startSaving = async () => {
    setIsSaving(true);
    const initialStatuses = pages.map(page => ({
      pageId: page.id,
      title: page.data.title,
      status: 'pending' as const
    }));
    setSaveStatuses(initialStatuses);

    for (const page of pages) {
      try {
        const response = await onSave(page.id);
        setSaveStatuses(prev => 
          prev.map(status => 
            status.pageId === page.id 
              ? { ...status, status: 'success', response }
              : status
          )
        );
      } catch (error) {
        setSaveStatuses(prev => 
          prev.map(status => 
            status.pageId === page.id 
              ? { ...status, status: 'error', error: error instanceof Error ? error.message : 'Failed to save' }
              : status
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
                  {status.response && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setSelectedResponse({ 
                        title: status.title,
                        data: status.response 
                      })}
                    >
                      <Code className="h-4 w-4" />
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

      {selectedResponse && (
        <CodeModal
          isOpen={true}
          onClose={() => setSelectedResponse(null)}
          code={JSON.stringify(selectedResponse.data, null, 2)}
          title={`API Response - ${selectedResponse.title}`}
        />
      )}
    </>
  );
}