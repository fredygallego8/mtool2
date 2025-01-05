import axios from 'axios';
import { BuilderApiResponse } from './types';
import { handleApiError } from './utils/error-handlers';

const API_KEY = '93c9efe4c0664a21aa4f706e8b71e1e4';
const PRIVATE_KEY = 'bpk-932b23b2dadc4057a8d1934db9f70e00';
const BASE_URL = 'https://cdn.builder.io/api/v3/content';
const WRITE_URL = 'https://builder.io/api/v1/write';

export async function fetchBuilderPages() {
  try {
    const response = await axios.get<BuilderApiResponse>(`${BASE_URL}/page`, {
      params: {
        apiKey: API_KEY,
        limit: 10,
        fields: 'data.title,name,id,lastUpdated,data.url,published',
        cachebust: true,
        model: 'page'
      },
    });
    
    if (!response.data || !response.data.results) {
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
      `${WRITE_URL}/page/${pageId}`,
      { data: { title: newTitle } },
      {
        headers: {
          'Authorization': `Bearer ${PRIVATE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}