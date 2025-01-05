import { useState, useEffect } from 'react';
import { BUILDER_CONFIG } from '../lib/config/builder';
import { getStoredConfig, saveConfig } from '../lib/config/storage';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: typeof BUILDER_CONFIG) => void;
}

export const ConfigModal = ({ isOpen, onClose, onSave }: ConfigModalProps) => {
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
    
    // Validate required fields
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Builder.io Configuration</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {key}
                {(key === 'API_KEY' || key === 'BASE_URL') && 
                  <span className="text-red-500">*</span>
                }
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setError(null);
                  setConfig(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }));
                }}
                className="w-full p-2 border rounded"
                required={key === 'API_KEY' || key === 'BASE_URL'}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};