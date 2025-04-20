import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMovieStore } from '../stores/movieStore';
import MovieList from '../components/MovieList';
import { useLandingScreenStore } from '../stores/landingScreenStore';
import { Movie } from '../models/Movie';
import { btoa, atob } from 'react-native-quick-base64'
import { useShallow } from 'zustand/shallow';

export default function MovieIndex() {
  const router = useRouter();
  
  const {
    categories,
    isLoading,
    error,
  } = useLandingScreenStore(
    useShallow((state) => ({
      categories: state.categories,
      isLoading: state.isLoading,
      error: state.error,
    }))
  );

  const initCategories = useLandingScreenStore(state => state.initCategories);
  const getAllCategories = useLandingScreenStore(state => state.getAllCategories);
  const refreshAllMovies = useLandingScreenStore(state => state.refreshAllMovies);

  const setSelectedMovie = useMovieStore(state => state.setSelectedMovie);
  const getSelectedMovie = useMovieStore(state => state.getSelectedMovie);

  useEffect(() => {
    const initialize = async () => {
      initCategories();
      getAllCategories();

      const movie = await getSelectedMovie();
      if (movie) {
        setSelectedMovie(movie);
        const base64 = btoa(`${movie.id}`);
        router.push(`/movie/${base64}`);
      }
    };

    initialize();
  }, [initCategories, getAllCategories]);

  const handleRefresh = async () => {
    await refreshAllMovies();
  };

  const handleMoviePress = (movie: Movie) => {
    setSelectedMovie(movie);
    const base64 = btoa(`${movie.id}`);
    router.push(`/movie/${base64}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#032541" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>All Movies</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={['#032541']}
            tintColor="#032541"
          />
        }
      >
        {categories.map((category: any, index: number) => (
          <MovieList
            key={`${category.header}-${index}`}
            title={category.header}
            endpoint={category.endpoint}
            onMoviePress={handleMoviePress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#032541',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffcccc',
    borderRadius: 4,
    margin: 16,
  },
  errorText: {
    color: '#cc0000',
    textAlign: 'center',
  },
});
