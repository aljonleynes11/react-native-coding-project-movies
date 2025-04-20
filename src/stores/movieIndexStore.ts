import { create } from 'zustand';
import  { getMoviesByEndpoint } from '../services/httpClient';
import categoriesData from '../mockups/categories.json';
import { Category } from '../models/Category';
import { CategoryMovies } from '../models/CategoriesMovie';

interface MovieIndexState {
  categories: Category[];
  categoryMovies: Record<string, CategoryMovies>;
  isLoading: boolean;
  error: string | null;
  
  initCategories: () => void;
  getMoviesForCategory: (category: Category) => Promise<void>;
  getAllCategories: () => Promise<void>;
  refreshAllMovies: () => Promise<void>;
}


export const useMovieIndexStore = create<MovieIndexState>((set, get) => ({
  categories: [],
  categoryMovies: {},
  isLoading: false,
  error: null,
  

  initCategories: () => {
    set({ 
      categories: categoriesData.categories,
      isLoading: false,
      error: null
    });
  },
  

  getMoviesForCategory: async (category: Category) => {
    const categoryId = `${category.header}`;
    
    set((state) => ({
      categoryMovies: {
        ...state.categoryMovies,
        [categoryId]: {
          categoryId,
          movies: state.categoryMovies[categoryId]?.movies || [],
          loading: true,
          error: null
        }
      }
    }));
    
    try {
      const response = await getMoviesByEndpoint(category.endpoint);
      
      set((state) => ({
        categoryMovies: {
          ...state.categoryMovies,
          [categoryId]: {
            categoryId,
            movies: response.results,
            loading: false,
            error: null
          }
        }
      }));
    } catch (error) {
      console.error(`Error fetching ${category.header}:`, error);
      
      set((state) => ({
        categoryMovies: {
          ...state.categoryMovies,
          [categoryId]: {
            categoryId,
            movies: state.categoryMovies[categoryId]?.movies || [],
            loading: false,
            error: `Failed to load ${category.header}`
          }
        }
      }));
    }
  },
  

  getAllCategories: async () => {
    const { categories } = get();
    set({ isLoading: true, error: null });
    
    try {
      const fetchPromises = categories.map(category => 
        get().getMoviesForCategory(category)
      );
      
      await Promise.all(fetchPromises);
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching all categories:', error);
      set({ 
        error: 'Failed to load movies. Please check your connection and try again.',
        isLoading: false
      });
    }
  },
  

  refreshAllMovies: async () => {
    set((state) => ({
      categoryMovies: {},
      isLoading: true,
      error: null
    }));
    
    await get().getAllCategories();
  }
})); 