'use client';

import { useState, useEffect } from 'react';
import { BUILDER_CONFIG } from '../lib/config/builder';
import { getStoredConfig, saveConfig } from '../lib/config/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: typeof BUILDER_CONFIG) => void;
}

export function ConfigModal({ isOpen, onClose, onSave }: ConfigModalProps) {
  const [config, setConfig] = useState(BUILDER_CONFIG);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedConfig = getStoredConfig();
    if (storedConfig) {
      setConfig(storedConfig);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.API_KEY || !config.BASE_URL) {
      setError('API Key and Base URL are required');
      return;
    }

    try {
      saveConfig(config);
      onSave(config);
      onClose();
    } catch (err) {
      setError('Failed to save configuration');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Builder.io Configuration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>
                {key}
                {(key === 'API_KEY' || key === 'BASE_URL') && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
              <Input
                id={key}
                type="text"
                value={value}
                onChange={(e) => {
                  setError(null);
                  setConfig(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }));
                }}
                required={key === 'API_KEY' || key === 'BASE_URL'}
              />
            </div>
          ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}