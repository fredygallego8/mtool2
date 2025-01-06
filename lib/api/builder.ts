import axios from 'axios';
import { BuilderApiResponse } from '@/lib/types';
import { handleApiError } from '@/lib/utils/error-handlers';
import { BUILDER_CONFIG } from '@/lib/config/builder';

export async function fetchBuilderPages() {
  try {
    const response = await axios.get<BuilderApiResponse>(`${BUILDER_CONFIG.BASE_URL}/page`, {
      params: {
        apiKey: BUILDER_CONFIG.API_KEY,
        limit: 10,
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
  try {
    const response = await axios.patch(
      `${BUILDER_CONFIG.WRITE_URL}/page/${pageId}`,
      { data: { title: newTitle } },
      {
        headers: {
          'Authorization': `Bearer ${BUILDER_CONFIG.PRIVATE_KEY}`,
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
  try {
    const response = await axios.put(
      `${BUILDER_CONFIG.WRITE_URL}/page/${pageId}`,
      {
        data: {
          blocks,
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
          'Authorization': `Bearer ${BUILDER_CONFIG.PRIVATE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}