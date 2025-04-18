import React from 'react';
import { 
  TouchableOpacity, 
  Image, 
  Text, 
  StyleSheet 
} from 'react-native';
import { Movie } from '../models/Movie';

interface MovieItemProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => onPress && onPress(movie)}
    >
      <Image
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
            : 'https://via.placeholder.com/185x278?text=No+Image',
        }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle} numberOfLines={1}>
        {movie.title}
      </Text>
      <Text style={styles.rating}>{movie.vote_average.toFixed(1)} ⭐</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default MovieItem; 