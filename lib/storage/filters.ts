'use client';

const URL_FILTERS_KEY = 'builder_url_filters';
const NODE_FILTER_KEY = 'builder_node_filter';

export function getStoredUrlFilters(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(URL_FILTERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveUrlFilters(urls: string[]) {
  localStorage.setItem(URL_FILTERS_KEY, JSON.stringify(urls));
}

export function getStoredNodeFilter(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(NODE_FILTER_KEY) || '';
}

export function saveNodeFilter(filter: string) {
  localStorage.setItem(NODE_FILTER_KEY, filter);
}