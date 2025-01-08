'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { getStoredUrlFilters, saveUrlFilters } from "@/lib/storage/filters";

interface UrlFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (urls: string[]) => void;
}

export function UrlFilterModal({ isOpen, onClose, onFilter }: UrlFilterModalProps) {
  const [urls, setUrls] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedUrls = getStoredUrlFilters();
      setUrls(storedUrls.join('\n'));
    }
  }, [isOpen]);

  const handleFilter = () => {
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    saveUrlFilters(urlList);
    onFilter(urlList);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filter Pages by URLs</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="Enter URLs (one per line)"
            className="min-h-[200px] font-mono"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleFilter}>
            Apply Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}