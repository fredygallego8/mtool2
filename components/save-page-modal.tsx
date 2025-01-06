'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Save, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Action {
  id: string;
  type: 'request' | 'response' | 'error';
  status: 'pending' | 'complete';
  message: string;
  timestamp: Date;
  details?: any;
}

interface SavePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  apiResponse: any;
  isSaving: boolean;
}

export function SavePageModal({ isOpen, onClose, onSave, apiResponse, isSaving }: SavePageModalProps) {
  const [actions, setActions] = useState<Action[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActions([]);
      setIsComplete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (apiResponse && actions.length > 0) {
      // Mark previous action as complete
      setActions(prev => prev.map(action => ({
        ...action,
        status: 'complete'
      })));

      // Add response action
      const responseAction: Action = {
        id: Date.now().toString(),
        type: 'response',
        status: 'complete',
        message: 'Changes saved successfully',
        timestamp: new Date(),
        details: apiResponse
      };
      setActions(prev => [...prev, responseAction]);
      setIsComplete(true);
    }
  }, [apiResponse]);

  const handleSave = async () => {
    const requestAction: Action = {
      id: Date.now().toString(),
      type: 'request',
      status: 'pending',
      message: 'Sending update request to API...',
      timestamp: new Date()
    };
    setActions([requestAction]);

    try {
      await onSave();
    } catch (error) {
      const errorAction: Action = {
        id: Date.now().toString(),
        type: 'error',
        status: 'complete',
        message: 'Error occurred while saving changes',
        timestamp: new Date(),
        details: error
      };
      setActions(prev => [...prev, errorAction]);
      setIsComplete(true);
    }
  };

  const getActionIcon = (type: Action['type'], status: Action['status']) => {
    if (status === 'pending') {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    switch (type) {
      case 'request':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'response':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] min-h-[50vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Save Changes</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 mt-4 overflow-auto space-y-4">
          {actions.map(action => (
            <div 
              key={action.id}
              className={`flex flex-col gap-2 p-4 rounded-md transition-colors ${
                action.status === 'complete' ? 'bg-muted/80' : 'bg-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getActionIcon(action.type, action.status)}
                  <span className="font-medium">{action.message}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {action.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {action.details && (
                <div className="mt-2 bg-background rounded-md p-4">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(action.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {isComplete ? 'Close' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isComplete}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}