import React, { useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator
} from 'react-native';
import { useMovieListStore } from '../stores/movieListStore';
import { Movie } from '../models/Movie';
import MovieItem from './MovieItem';
import { useShallow } from 'zustand/shallow';

interface MovieListProps {
  title: string;
  endpoint: string;
  onMoviePress?: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({ 
  title,
  endpoint,
  onMoviePress
}) => {
  const defaultMovieList = useMemo(() => ({
    listId: title,
    movies: [],
    loading: true,
    error: null
  }), [title]);

  const { movies, loading, error } = useMovieListStore(
    useShallow((state) => state.movieLists[title] || defaultMovieList)
  );
  
  const fetchMovieList = useMovieListStore(state => state.fetchMovieList);

  useEffect(() => {
    if ((!movies.length && !loading) || (!movies.length && loading)) {
      fetchMovieList({ listId: title, endpoint });
    }
  }, [title, endpoint, fetchMovieList, movies.length, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#032541" />
      </View>
    );
  }

  if (error || movies.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || `No ${title} available`}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => `${item.id}-${title}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <MovieItem 
            movie={item} 
            onPress={onMoviePress} 
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
    color: '#333',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffcccc',
    borderRadius: 4,
    margin: 16,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MovieList;