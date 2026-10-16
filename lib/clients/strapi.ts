import 'server-only';
import { pages as fallbackPages } from '../data/content';
import type { Page } from '../types';

// Note: Endpoints follow typical Strapi REST shapes. Update paths if your content types differ.
const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const withBase = (url?: string) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (!STRAPI_API_URL) return url;
  return `${STRAPI_API_URL}${url}`;
};

const strapiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T | null> => {
  if (!STRAPI_API_URL) return null;
  try {
    const res = await fetch(`${STRAPI_API_URL}${path}`, {
      ...options,
      headers: {
        ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
};

const normalizePage = (entry: any): Page => ({
  id: entry?.id?.toString?.() || crypto.randomUUID(),
  slug: entry?.attributes?.slug || entry?.slug || 'page',
  title: entry?.attributes?.title || entry?.title || 'Page',
  hero: entry?.attributes?.hero || entry?.hero || 'Atelier-crafted essentials designed for a confident fit.',
  sections:
    entry?.attributes?.sections?.map((section: any) => ({
      title: section?.title || 'Section',
      body: section?.body || '',
    })) || [],
});

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const data = await strapiFetch<{ data?: any[] }>(
    `/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}`
  );
  const page = data?.data?.[0] ? normalizePage(data.data[0]) : null;
  return page || fallbackPages.find((item) => item.slug === slug) || null;
};
