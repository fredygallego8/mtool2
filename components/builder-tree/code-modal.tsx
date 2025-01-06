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
import { Textarea } from "@/components/ui/textarea";
import { Copy, Save, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  title: string;
  onSave?: (newCode: string) => Promise<void>;
}

export const CodeModal: React.FC<CodeModalProps> = ({ 
  isOpen, 
  onClose, 
  code: initialCode, 
  title,
  onSave 
}) => {
  const [code, setCode] = useState(initialCode);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      
      // Handle empty or whitespace-only code
      const trimmedCode = code.trim();
      if (!trimmedCode) {
        await onSave("{}");
        onClose();
        toast({
          title: "Saved",
          description: "Changes saved successfully",
        });
        return;
      }

      // Validate JSON for non-empty code
      JSON.parse(trimmedCode);
      await onSave(trimmedCode);
      onClose();
      toast({
        title: "Saved",
        description: "Changes saved successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof SyntaxError ? "Invalid JSON" : "Save failed",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-background">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono min-h-[400px] bg-background"
          />
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            {onSave && (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};