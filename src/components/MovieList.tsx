import React, { useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useMovieListStore } from '../stores/movieListStore';
import { Movie } from '../models/Movie';
import MovieItem from './MovieItem';
import { useShallow } from 'zustand/shallow';
import { useRouter } from 'expo-router';

interface MovieListProps {
  title: string;
  endpoint: string;
  onMoviePress?: (movie: Movie) => void;
  hideNavigation?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ 
  title,
  endpoint,
  onMoviePress,
  hideNavigation = false
}) => {
  const router = useRouter();
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

  const handleTitlePress = () => {
    router.push({
      pathname: '/category',
      params: {
        id: encodeURIComponent(title),
        title: encodeURIComponent(title),
        endpoint: encodeURIComponent(endpoint)
      }
    });
  };

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

  const renderTitle = () => {
    if (hideNavigation) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.titleContainer}
        onPress={handleTitlePress}
      >
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderTitle()}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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