import { AxiosError } from 'axios';

export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    if (status === 401) {
      throw new Error('Authentication failed. Please check your API credentials.');
    }
    
    if (status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }
    
    throw new Error(message || 'An error occurred while communicating with Builder.io');
  }
  
  throw error;
}