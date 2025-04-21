import { create } from 'zustand';
import { getMoviesByEndpoint } from '../services/httpClient';
import { Movie, MovieResponse } from '../models/Movie';

interface CategoryState {
  categoryId: string | null;
  categoryTitle: string | null;
  categoryEndpoint: string | null;
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalResults: number;
  
  setCategory: (id: string, title: string, endpoint: string) => void;
  loadCategoryMovies: (page?: number) => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  clearCategory: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categoryId: null,
  categoryTitle: null,
  categoryEndpoint: null,
  movies: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 0,
  totalResults: 0,
  
  setCategory: (id: string, title: string, endpoint: string) => {
    set({
      categoryId: id,
      categoryTitle: title,
      categoryEndpoint: endpoint,
      movies: [],
      isLoading: false,
      error: null,
      page: 1,
      totalPages: 0,
      totalResults: 0
    });
  },
  
  loadCategoryMovies: async (page = 1) => {
    const { categoryEndpoint } = get();
    
    if (!categoryEndpoint) {
      set({ error: 'Category not selected' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const response: MovieResponse = await getMoviesByEndpoint(categoryEndpoint, page);
      
      set((state) => ({
        movies: page === 1 ? response.results : [...state.movies, ...response.results],
        isLoading: false,
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results
      }));
    } catch (error) {
      console.error('Error loading category movies:', error);
      set({ 
        error: 'Failed to load movies. Please try again.',
        isLoading: false 
      });
    }
  },
  
  loadMoreMovies: async () => {
    const { page, totalPages, isLoading } = get();
    
    if (isLoading || page >= totalPages) {
      return;
    }
    
    await get().loadCategoryMovies(page + 1);
  },
  
  clearCategory: () => {
    set({
      categoryId: null,
      categoryTitle: null,
      categoryEndpoint: null,
      movies: [],
      isLoading: false,
      error: null,
      page: 1,
      totalPages: 0,
      totalResults: 0
    });
  }
})); 