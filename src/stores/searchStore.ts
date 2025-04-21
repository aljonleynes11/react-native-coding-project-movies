import { create } from 'zustand';
import { searchMovies } from '../services/httpClient';
import { Movie, MovieResponse } from '../models/Movie';

interface SearchState {
  searchResults: Movie[];
  searchQuery: string;
  isSearching: boolean;
  searchPage: number;
  searchTotalPages: number;
  searchTotalResults: number;
  searchError: string | null;
  
  searchForMovies: (query: string, page?: number) => Promise<void>;
  loadMoreSearchResults: () => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchResults: [],
  searchQuery: '',
  isSearching: false,
  searchPage: 1,
  searchTotalPages: 0,
  searchTotalResults: 0,
  searchError: null,
  
  searchForMovies: async (query: string, page = 1) => {
    if (!query.trim()) {
      set({ 
        searchResults: [], 
        searchQuery: '',
        isSearching: false,
        searchPage: 1,
        searchTotalPages: 0,
        searchTotalResults: 0,
        searchError: null
      });
      return;
    }

    set({ 
      isSearching: true,
      searchQuery: query,
      searchPage: page,
      searchError: null
    });
    
    try {
      const response: MovieResponse = await searchMovies(query, page);
      
      set({ 
        searchResults: page === 1 ? response.results : [...get().searchResults, ...response.results],
        isSearching: false,
        searchPage: response.page,
        searchTotalPages: response.total_pages,
        searchTotalResults: response.total_results,
        searchError: null
      });
    } catch (error) {
      console.error('Error searching movies:', error);
      set({ 
        isSearching: false,
        searchError: 'Failed to search movies. Please try again.'
      });
    }
  },
  
  loadMoreSearchResults: async () => {
    const { searchQuery, searchPage, searchTotalPages, isSearching } = get();
    
    if (!searchQuery || isSearching || searchPage >= searchTotalPages) {
      return;
    }
    
    await get().searchForMovies(searchQuery, searchPage + 1);
  },

  clearSearch: () => {
    set({ 
      searchResults: [],
      searchQuery: '',
      isSearching: false,
      searchPage: 1,
      searchTotalPages: 0,
      searchTotalResults: 0,
      searchError: null
    });
  }
})); 