import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCategoryStore } from '../../stores/categoryStore';
import { useMovieStore } from '../../stores/movieStore';
import { Ionicons } from '@expo/vector-icons';
import { useShallow } from 'zustand/shallow';
import { Movie } from '../../models/Movie';
import { btoa } from 'react-native-quick-base64';
import MovieGrid from '../../components/MovieGrid';

const CategoryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, endpoint } = params;

  const {
    categoryTitle,
    movies,
    isLoading,
    error,
    page,
    totalPages,
    totalResults
  } = useCategoryStore(
    useShallow((state) => ({
      categoryTitle: state.categoryTitle,
      movies: state.movies,
      isLoading: state.isLoading,
      error: state.error,
      page: state.page,
      totalPages: state.totalPages,
      totalResults: state.totalResults
    }))
  );

  const setCategory = useCategoryStore((state) => state.setCategory);
  const loadCategoryMovies = useCategoryStore((state) => state.loadCategoryMovies);
  const loadMoreMovies = useCategoryStore((state) => state.loadMoreMovies);
  const clearCategory = useCategoryStore((state) => state.clearCategory);

  const setSelectedMovie = useMovieStore((state) => state.setSelectedMovie);

  useEffect(() => {
    if (id && title && endpoint) {
      setCategory(id as string, title as string, endpoint as string);
      loadCategoryMovies();
    }

    return () => {
      clearCategory();
    };
  }, [id, title, endpoint]);

  const handleMoviePress = (movie: Movie) => {
    setSelectedMovie(movie);
    const base64 = btoa(`${movie.id}`);
    router.push(`/movie/${base64}`);
  };

  const handleLoadMore = () => {
    if (!isLoading && page < totalPages) {
      loadMoreMovies();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#032541" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle || title}</Text>
        <View style={styles.placeholder}></View>
      </View>

      <MovieGrid
        movies={movies}
        isLoading={isLoading}
        onMoviePress={handleMoviePress}
        onEndReached={handleLoadMore}
        emptyText={`No movies found in ${categoryTitle || title}`}
        error={error}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#032541',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#555',
  }
});

export default CategoryScreen; 