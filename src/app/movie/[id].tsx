import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '../../models/Movie';
import { useMovieStore } from '../../stores/movieStore';
import MovieList from '../../components/MovieList';
import MovieBackdrop from '../../components/MovieBackdrop';
import { formatDate } from '../../utils/utils';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const MovieShow = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isTrailerVisible, setTrailerVisible] = useState(false);
  
  const selectedMovie = useMovieStore(state => state.selectedMovie);
  const setSelectedMovie = useMovieStore(state => state.setSelectedMovie);
  const clearSelectedMovie = useMovieStore(state => state.clearSelectedMovie);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (selectedMovie) {
      setLoading(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [selectedMovie]);

  const handleMoviePress = (selectedMovie: Movie) => {
    setSelectedMovie(selectedMovie);
    router.push(`/movie/${selectedMovie.id}`);
  };

  const handleBackButtonPress = () => {
    clearSelectedMovie();
    router.back();
  };

  const handlePlayPress = (url: string) => {
    setTrailerUrl(url);
    setTrailerVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#032541" />
      </View>
    );
  }

  if (error || !selectedMovie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#032541" barStyle="light-content" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >
        <MovieBackdrop
          onBackPress={handleBackButtonPress}
          onPlayPress={handlePlayPress}
        />

        <View style={styles.headerContainer}>
          {selectedMovie.poster_path && (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w342${selectedMovie.poster_path}` }}
              style={styles.posterImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.title}>{selectedMovie.title}</Text>
            <Text style={styles.releaseDate}>Released: {formatDate(selectedMovie.release_date)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{selectedMovie.vote_average.toFixed(1)}⭐</Text>
              <Text style={styles.voteCount}>({selectedMovie.vote_count} votes)</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{selectedMovie.overview || 'No overview available.'}</Text>
        </View>

        <View>
          <MovieList
            title="Similar Movies"
            endpoint={`/movie/${selectedMovie?.id}/similar`}
            onMoviePress={handleMoviePress}
            hideNavigation={true}
          />
        </View>

        <View style={styles.recommendedMoviesContainer}>
          <MovieList
            title="Recommended Movies"
            endpoint={`/movie/${selectedMovie?.id}/recommendations`}
            onMoviePress={handleMoviePress}
            hideNavigation={true}
          />
        </View>
      </ScrollView>

      <Modal visible={isTrailerVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <TouchableOpacity style={{ padding: 16 }} onPress={() => setTrailerVisible(false)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <WebView
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            source={{ uri: trailerUrl! }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export default MovieShow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    marginTop: -40,
  },
  posterImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#032541',
    marginRight: 8,
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  movieListContainer: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 16,
    textAlign: 'center',
  },
  recommendedMoviesContainer: {
    marginBottom: '80%',
  },
});
