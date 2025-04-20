import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../models/Movie';

interface MovieStoreState {
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie) => void;
  clearSelectedMovie: () => Promise<void>;
  getSelectedMovie: () => Promise<Movie | null>;
}

export const useMovieStore = create<MovieStoreState>((set) => ({
  selectedMovie: null,

  setSelectedMovie: async (movie: Movie) => {
    set({ selectedMovie: movie });
    await AsyncStorage.setItem('selectedMovie', JSON.stringify(movie));
  },

  clearSelectedMovie: async () => {
    set({ selectedMovie: null });
    await AsyncStorage.removeItem('selectedMovie');
  },

  getSelectedMovie: async () => {
    const movie = await AsyncStorage.getItem('selectedMovie');
    return movie ? JSON.parse(movie) : null;
  },
}));
