export interface BuilderPage {
  id: string;
  name: string;
  lastUpdated: number;
  published: string;
  data: {
    title: string;
    url: string;
    blocks: Array<{
      component: {
        name: string;
      };
    }>;
  };
  meta?: {
    lastPreviewUrl?: string;
  };
}

export interface BuilderApiResponse {
  results: BuilderPage[];
}