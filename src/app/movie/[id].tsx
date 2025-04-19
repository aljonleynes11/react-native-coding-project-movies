import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Movie } from '../../models/Movie';

export default function MovieShow() {
  const { id, movieData } = useLocalSearchParams<{ id: string, movieData: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    try {
      // Try to parse the movie data from the params
      if (movieData) {
        const parsedMovie = JSON.parse(movieData) as Movie;
        setMovie(parsedMovie);
        setLoading(false);
      } else {
        // If no movieData is provided, we could fetch it from the API using the ID
        // This would be implemented in a real app
        setError("No movie data provided");
        setLoading(false);
      }
    } catch (err) {
      setError("Error loading movie data");
      setLoading(false);
      console.error("Error parsing movie data:", err);
    }
  }, [id, movieData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#032541" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Movie not found"}</Text>
      </View>
    );
  }

  // Movie details view - integrated from MovieViewScreen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#032541" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {movie.backdrop_path && (
          <Image 
            source={{ uri: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.headerContainer}>
          {movie.poster_path && (
            <Image 
              source={{ uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}` }}
              style={styles.posterImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.releaseDate}>Released: {formatDate(movie.release_date)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
              <Text style={styles.voteCount}>({movie.vote_count} votes)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview || 'No overview available.'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  backdropImage: {
    width: '100%',
    height: 200,
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
}); 