import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchTrailer } from '../services/httpClient';
import { useMovieStore } from '../stores/movieStore';

interface MovieBackdropProps {
  onBackPress: () => void;
  onPlayPress: (trailerUrl: string) => void;
}

const MovieBackdrop: React.FC<MovieBackdropProps> = ({
  onBackPress,
  onPlayPress,
}) => {
  const { selectedMovie } = useMovieStore();
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    const getTrailer = async () => {
      if (selectedMovie?.id) {
        const url = await fetchTrailer(selectedMovie.id);
        setTrailerUrl(url);
      }
    };

    getTrailer();
  }, [selectedMovie?.id]);

  return (
    <View style={styles.backdropContainer}>
      {selectedMovie?.backdrop_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}` }}
          style={styles.backdropImage}
          resizeMode="cover"
        />
      )}

      {trailerUrl && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => onPlayPress(trailerUrl)}
        >
          <Ionicons name="play-circle-outline" size={64} color="white" />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backdropContainer: {
    position: 'relative',
    width: '100%',
    height: '20%',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '40%',
    left: '42%',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
    backgroundColor: '#032541',
    borderRadius: 24,
    padding: 8,
    elevation: 5,
  },
});

export default MovieBackdrop; 