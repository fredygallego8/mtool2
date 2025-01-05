import { BUILDER_CONFIG } from "./builder";

export const CONFIG_STORAGE_KEY = 'builder_config';

export const getStoredConfig = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveConfig = (config: typeof BUILDER_CONFIG) => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};