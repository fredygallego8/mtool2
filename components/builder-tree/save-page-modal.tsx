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
import { Loader2, Save, CheckCircle2, XCircle } from "lucide-react";

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

export const SavePageModal: React.FC<SavePageModalProps> = ({ 
  isOpen, 
  onClose,
  onSave,
  apiResponse,
  isSaving
}) => {
  const [actions, setActions] = useState<Action[]>([]);

  // Reset actions when modal opens
  useEffect(() => {
    if (isOpen) {
      setActions([]);
    }
  }, [isOpen]);

  // Update previous action to complete when a new one is added
  useEffect(() => {
    if (actions.length > 1) {
      setActions(prev => 
        prev.map((action, index) => 
          index === prev.length - 2 ? { ...action, status: 'complete' } : action
        )
      );
    }
  }, [actions.length]);

  const handleSave = async () => {
    // Add request action
    const requestAction: Action = {
      id: Date.now().toString(),
      type: 'request',
      status: 'pending',
      message: 'Sending update request to Builder.io API',
      timestamp: new Date()
    };
    setActions(prev => [...prev, requestAction]);

    try {
      await onSave();
      
      // Add success response action
      const responseAction: Action = {
        id: (Date.now() + 1).toString(),
        type: 'response',
        status: 'pending',
        message: 'Successfully updated page content',
        timestamp: new Date(),
        details: apiResponse
      };
      setActions(prev => [...prev, responseAction]);

      // Update the last action to complete and close modal after a short delay
      setTimeout(() => {
        setActions(prev => 
          prev.map((action, index) => 
            index === prev.length - 1 ? { ...action, status: 'complete' } : action
          )
        );
        onClose();
      }, 1000);
    } catch (error) {
      // Add error action
      const errorAction: Action = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        status: 'complete',
        message: error instanceof Error ? error.message : 'Failed to update page',
        timestamp: new Date(),
        details: error
      };
      setActions(prev => [...prev, errorAction]);
    }
  };

  const getActionIcon = (type: Action['type'], status: Action['status']) => {
    if (status === 'pending' && type === 'request') {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    switch (type) {
      case 'request':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'response':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] h-[800px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Save Page Changes</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 mt-4 overflow-auto space-y-4">
          {/* Action List */}
          <div className="space-y-2">
            {actions.map(action => (
              <div 
                key={action.id}
                className={`flex items-start gap-2 p-2 rounded-md transition-colors ${
                  action.status === 'complete' ? 'bg-muted/80' : 'bg-muted'
                }`}
              >
                {getActionIcon(action.type, action.status)}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{action.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {action.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {action.details && (
                    <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto">
                      {JSON.stringify(action.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
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
};