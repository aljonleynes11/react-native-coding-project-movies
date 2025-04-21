import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { Movie } from '../models/Movie';
import { formatDate } from '../utils/utils';
import { Ionicons } from '@expo/vector-icons';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  onMoviePress: (movie: Movie) => void;
  onEndReached?: () => void;
  ListHeaderComponent?: React.ReactElement;
  emptyText?: string;
  error?: string | null;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading,
  onMoviePress,
  onEndReached,
  ListHeaderComponent,
  emptyText = 'No movies found',
  error
}) => {
  const renderFooter = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#032541" />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#cc0000" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (movies.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="film-outline" size={48} color="#888" />
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.movieItem}
          onPress={() => onMoviePress(item)}
        >
          <View style={styles.posterContainer}>
            {item.poster_path ? (
              <>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                  style={styles.posterImage}
                  resizeMode="cover"
                />
                <View style={styles.posterWrapper}>
                  <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.movieDate}>
                    {formatDate(item.release_date)}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.noPoster}>
                <Text style={styles.noPosterText}>{item.title}</Text>
                <Text style={styles.noPosterSubtext}>{formatDate(item.release_date)}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#032541" />
          </View>
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
    paddingBottom: 24,
  },
  movieItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  posterContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    aspectRatio: 2/3,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  posterWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  movieTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  movieDate: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  noPoster: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#032541',
  },
  noPosterText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noPosterSubtext: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cc0000',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default MovieGrid; 