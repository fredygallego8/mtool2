import React from 'react';
import { Dialog } from '@headlessui/react';
import { Copy as CopyIcon, X as XIcon } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  title: string;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, code, title }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 rounded"
                title="Copy to clipboard"
              >
                <CopyIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-[80vh]">
            <code>{code}</code>
          </pre>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};