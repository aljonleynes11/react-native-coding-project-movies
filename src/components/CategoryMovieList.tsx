import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useLandingPageStore } from '../stores/landingPageStore';


interface CategoryMovieListProps {
  categoryTitle: string;
  endpoint: string;

}

const CategoryMovieList: React.FC<CategoryMovieListProps> = ({ 
  categoryTitle,
  endpoint 
}) => {

  const categoryMovies = useLandingPageStore(
    state => state.categoryMovies[categoryTitle] || {
      categoryId: categoryTitle,
      movies: [],
      loading: true,
      error: null
    }
  );
  

  const fetchMoviesForCategory = useLandingPageStore(state => state.fetchMoviesForCategory);
  

  useEffect(() => {

    if (!categoryMovies.movies.length && !categoryMovies.loading) {
      fetchMoviesForCategory({ header: categoryTitle, endpoint });
    }
  }, [categoryTitle, endpoint, fetchMoviesForCategory, categoryMovies]);

  const { movies, loading, error } = categoryMovies;

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
        <Text style={styles.errorText}>{error || `No ${categoryTitle} available`}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryTitle}</Text>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => `${item.id}-${categoryTitle}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.movieCard}>
            <Image
              source={{
                uri: item.poster_path
                  ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
                  : 'https://via.placeholder.com/185x278?text=No+Image',
              }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.rating}>{item.vote_average.toFixed(1)} ⭐</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
    color: '#333',
  },
  movieCard: {
    width: 120,
    marginLeft: 16,
    marginBottom: 8,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#d63031',
    fontSize: 14,
  },
});

export default CategoryMovieList; 