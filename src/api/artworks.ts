import type { ArtworksResponse } from '../types/artwork';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';
const FIELDS = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';
export async function fetchPage(page: number, limit = 12): Promise<ArtworksResponse> {
  const url = `${BASE_URL}?page=${page}&limit=${limit}&fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<ArtworksResponse>;
}
