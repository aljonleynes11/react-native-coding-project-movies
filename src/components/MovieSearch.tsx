import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchStore } from '../stores/searchStore';
import { useShallow } from 'zustand/shallow';
import { Movie } from '../models/Movie';
import MovieGrid from './MovieGrid';

interface MovieSearchProps {
  onMoviePress: (movie: Movie) => void;
}

const MovieSearch = ({ onMoviePress }: MovieSearchProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const {
    searchResults,
    isSearching,
    searchQuery,
    searchTotalResults,
    searchPage,
    searchTotalPages,
    searchError
  } = useSearchStore(
    useShallow((state) => ({
      searchResults: state.searchResults,
      isSearching: state.isSearching,
      searchQuery: state.searchQuery,
      searchTotalResults: state.searchTotalResults,
      searchPage: state.searchPage,
      searchTotalPages: state.searchTotalPages,
      searchError: state.searchError
    }))
  );

  const searchForMovies = useSearchStore(state => state.searchForMovies);
  const loadMoreSearchResults = useSearchStore(state => state.loadMoreSearchResults);
  const clearSearch = useSearchStore(state => state.clearSearch);

  const toggleSearch = () => {
    if (showSearch && searchText) {
      clearSearch();
      setSearchText('');
    }
    setShowSearch(!showSearch);
  };

  const handleSearch = async () => {
    if (searchText.trim()) {
      await searchForMovies(searchText.trim());
    }
  };

  const handleLoadMore = () => {
    if (searchQuery && !isSearching && searchPage < searchTotalPages) {
      loadMoreSearchResults();
    }
  };

  const renderSearchBar = () => {
    if (!showSearch) return null;
    
    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search movies..."
          placeholderTextColor="#888"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoFocus
        />
        {isSearching && (
          <ActivityIndicator size="small" color="#032541" style={styles.searchingIndicator} />
        )}
        {searchText ? (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => {
              setSearchText('');
              clearSearch();
            }}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const SearchHeader = () => {
    if (!searchQuery || !searchResults.length) return null;
    
    return (
      <View style={styles.searchResultsHeader}>
        <Text style={styles.searchResultsTitle}>
          Search Results for "{searchQuery}" ({searchTotalResults} {searchTotalResults === 1 ? 'movie' : 'movies'})
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Search Movies</Text>
        <TouchableOpacity style={styles.searchIcon} onPress={toggleSearch}>
          <Ionicons 
            name={showSearch ? "close" : "search"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {renderSearchBar()}
      
      {searchQuery ? (
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
        >
          <MovieGrid
            movies={searchResults}
            isLoading={isSearching}
            onMoviePress={onMoviePress}
            onEndReached={handleLoadMore}
            ListHeaderComponent={searchResults.length > 0 ? <SearchHeader /> : undefined}
            emptyText={`No results found for "${searchQuery}"`}
            error={searchError}
          />
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#032541',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  searchIcon: {
    padding: 8,
  },
  scrollContainer: {
    maxHeight: '70%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchingIndicator: {
    marginRight: 8,
  },
  searchResultsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  }
});

export default MovieSearch; 