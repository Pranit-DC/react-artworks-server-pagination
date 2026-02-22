import { useEffect, useReducer } from 'react';
import { fetchPage } from '../api/artworks';
import type { Artwork, ArtworkPagination } from '../types/artwork';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Artwork[]; pagination: ArtworkPagination }
  | { status: 'error'; message: string };

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_OK'; data: Artwork[]; pagination: ArtworkPagination }
  | { type: 'FETCH_ERR'; message: string };

function reducer(_: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START': return { status: 'loading' };
    case 'FETCH_OK':    return { status: 'success', data: action.data, pagination: action.pagination };
    case 'FETCH_ERR':   return { status: 'error', message: action.message };
  }
}

export function useArtworks(page: number) {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });

  useEffect(() => {
    let stale = false;
    dispatch({ type: 'FETCH_START' });

    fetchPage(page)
      .then(res => {
        if (!stale) dispatch({ type: 'FETCH_OK', data: res.data, pagination: res.pagination });
      })
      .catch((err: unknown) => {
        if (!stale) dispatch({ type: 'FETCH_ERR', message: err instanceof Error ? err.message : 'Unknown error' });
      });

    return () => { stale = true; };
  }, [page]);

  return state;
}
