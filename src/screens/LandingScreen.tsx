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

import MovieList from '../components/MovieList';
import { useLandingScreenStore } from '../stores/landingScreenStore';
import { Movie } from '../models/Movie';

const LandingScreen = () => {
  const {
    categories,
    isLoading,
    error,
    initializeCategories,
    fetchAllCategoryMovies,
    refreshAllMovies
  } = useLandingScreenStore();

  useEffect(() => {
    initializeCategories();
    fetchAllCategoryMovies();
  }, [initializeCategories, fetchAllCategoryMovies]);

  const handleRefresh = async () => {
    await refreshAllMovies();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#032541" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>TMDB Movies</Text>
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
        {categories.map((category, index) => (
          <MovieList
            key={`${category.header}-${index}`}
            title={category.header}
            endpoint={category.endpoint}
            onMoviePress={(movie:Movie)=>{
              console.log('Movie pressed:', movie.title);
            }}
          />
        ))}
      </ScrollView>
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

export default LandingScreen;
