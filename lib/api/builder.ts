'use client';

import axios from 'axios';
import { BuilderApiResponse } from '@/lib/types';
import { handleApiError } from '@/lib/utils/error-handlers';
import { BUILDER_CONFIG } from '@/lib/config/builder';
import { getStoredConfig } from '@/lib/config/storage';

const getConfig = () => {
  if (typeof window !== 'undefined') {
    return getStoredConfig() || BUILDER_CONFIG;
  }
  return BUILDER_CONFIG;
};

const isEmptyBlock = (block: any): boolean => {
  if (!block || typeof block !== 'object') return true;
  if (Object.keys(block).length === 0) return true;
  if (!block.component && !block.children?.length && !block.blocks?.length) return true;
  return false;
};

const filterEmptyBlocks = (blocks: any[]): any[] => {
  return blocks.filter(block => {
    if (isEmptyBlock(block)) return false;
    
    if (block.children?.length) {
      block.children = filterEmptyBlocks(block.children);
    }
    if (block.blocks?.length) {
      block.blocks = filterEmptyBlocks(block.blocks);
    }
    
    return true;
  });
};

export async function fetchBuilderPages() {
  const config = getConfig();
  try {
    const response = await axios.get<BuilderApiResponse>(`${config.BASE_URL}/page`, {
      params: {
        apiKey: config.API_KEY,
        limit: 120,
        fields: 'data.title,name,id,lastUpdated,data.url,published,data.blocks,meta.lastPreviewUrl,data.html,data.css,data.jsCode,data.cssCode,data.inputs,data.httpRequests,data.customFonts,data.state,data.description',
        cachebust: true,
        model: 'page'
      },
    });
    
    if (!response.data?.results) {
      throw new Error('Invalid API response format');
    }
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updatePageTitle(pageId: string, newTitle: string) {
  const config = getConfig();
  try {
    const response = await axios.patch(
      `${config.WRITE_URL}/page/${pageId}`,
      { data: { title: newTitle } },
      {
        headers: {
          'Authorization': `Bearer ${config.PRIVATE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updatePageBlocks(pageId: string, blocks: any[], originalData: any) {
  const config = getConfig();
  const filteredBlocks = filterEmptyBlocks(blocks);
  
  try {
    const response = await axios.put(
      `${config.WRITE_URL}/page/${pageId}`,
      {
        data: {
          blocks: filteredBlocks,
          html: originalData.html || '',
          css: originalData.css || '',
          url: originalData.url || '',
          jsCode: originalData.jsCode || '',
          cssCode: originalData.cssCode || '',
          inputs: originalData.inputs || [],
          httpRequests: originalData.httpRequests || [],
          customFonts: originalData.customFonts || [],
          state: originalData.state || {},
          title: originalData.title || '',
          description: originalData.description || ''
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.PRIVATE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}