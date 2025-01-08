'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface NodeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (componentName: string) => void;
}

export function NodeFilterModal({ isOpen, onClose, onFilter }: NodeFilterModalProps) {
  const [componentName, setComponentName] = useState('');

  const handleFilter = () => {
    onFilter(componentName.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter by Component Name</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="componentName">Component Name</Label>
            <Input
              id="componentName"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="Enter component name to filter"
            />
          </div>
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