import type { ArtworksResponse } from '../types/artwork';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';
const FIELDS = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';
const PAGE_SIZE = 12;

export async function fetchPage(page: number): Promise<ArtworksResponse> {
  const url = `${BASE_URL}?page=${page}&limit=${PAGE_SIZE}&fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<ArtworksResponse>;
}
