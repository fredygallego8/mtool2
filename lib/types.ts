export interface BuilderPage {
  id: string;
  name: string;
  lastUpdated: number;
  published: string;
  data: {
    title: string;
    url: string;
    html?: string;
    css?: string;
    jsCode?: string;
    cssCode?: string;
    inputs?: any[];
    httpRequests?: any[];
    customFonts?: any[];
    state?: any;
    description?: string;
    blocks: Array<{
      id?: string;
      component?: {
        name: string;
        options?: any;
      };
      children?: any[];
      blocks?: any[];
    }>;
  };
  meta?: {
    lastPreviewUrl?: string;
  };
}

export interface BuilderApiResponse {
  results: BuilderPage[];
}