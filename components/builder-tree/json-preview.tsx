'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface JsonPreviewProps {
  data: any;
  onUpdate?: (newData: any) => Promise<void>;
}

export function JsonPreview({ data, onUpdate }: JsonPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const { toast } = useToast();

  const handleEdit = () => {
    setJsonContent(JSON.stringify(data, null, 2));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      if (onUpdate) {
        await onUpdate(parsedJson);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "JSON updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <CardTitle className="text-lg">JSON Preview</CardTitle>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit JSON
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[calc(50vh-80px)] overflow-auto">
        {isEditing ? (
          <Textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="font-mono text-sm h-full resize-none"
          />
        ) : (
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        )}
      </CardContent>
    </Card>
  );
}