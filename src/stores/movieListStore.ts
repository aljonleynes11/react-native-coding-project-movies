import { create } from 'zustand';
import { getMoviesByEndpoint } from '../services/httpClient';
import { Movie } from '../models/Movie';

interface MovieListState {
  movieLists: {
    [key: string]: {
      listId: string;
      movies: Movie[];
      loading: boolean;
      error: string | null;
    };
  };
  fetchMovieList: (params: { listId: string; endpoint: string }) => Promise<void>;
}

export const useMovieListStore = create<MovieListState>((set, get) => ({
  movieLists: {},
  
  fetchMovieList: async ({ listId, endpoint }) => {
    set((state) => ({
      movieLists: {
        ...state.movieLists,
        [listId]: {
          listId,
          movies: state.movieLists[listId]?.movies || [],
          loading: true,
          error: null,
        },
      },
    }));

    try {
      const data = await getMoviesByEndpoint(endpoint);
      
      set((state) => ({
        movieLists: {
          ...state.movieLists,
          [listId]: {
            listId,
            movies: data.results || [],
            loading: false,
            error: null,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        movieLists: {
          ...state.movieLists,
          [listId]: {
            listId,
            movies: [],
            loading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
          },
        },
      }));
    }
  },
})); 