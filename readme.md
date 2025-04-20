# Movie Explorer App

A React Native mobile application that allows users to browse movies from The Movie Database (TMDB) API, view details, and watch trailers. Built with Expo and TypeScript.

## Development

This app was developed as part of a coding challenge and was completed in approximately 4 hours.

## Features

- Browse movies from different categories (popular, top-rated, upcoming, etc.)
- View detailed information about each movie
- Watch movie trailers directly in the app
- Explore similar and recommended movies
- Pull-to-refresh for updated content
- Smooth navigation between screens
- Dynamic category loading from configuration

## Technologies Used

- React Native with Expo
- TypeScript
- Expo Router for navigation
- Zustand for state management
- AsyncStorage for local data persistence
- TMDB API for movie data
- React Native WebView for trailer playback

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/aljonleynes11/react-native-coding-project-movies.git
   cd react-native-coding-project-movies
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your TMDB API key:
   ```
   TMDB_API_KEY=your_api_key_here
   ```
   
   You can use the provided `.env_example` file as a template:
   ```
   cp .env_example .env
   ```
   Then replace the placeholder value with your actual API key.

4. Start the development server:
   ```
   npx expo start
   ```

5. Run on a device or emulator:
   - Press `a` to run on Android emulator
   - Press `i` to run on iOS simulator
   - Scan the QR code with the Expo Go app on your physical device

## Implementation Details

### Architecture

The app follows a layered architecture:

- **UI Layer**: React components organized by feature
- **State Management**: Zustand stores for global state
- **Data Layer**: HTTP client for API communication
- **Navigation**: Expo Router for declarative navigation

### Movie Browsing Implementation

The app fetches and displays movies in a landing screen with multiple horizontal scrollable lists, each representing a different category (popular, top-rated, upcoming, etc.). Movie data is retrieved from TMDB API and stored in a Zustand store.

The `MovieList` component renders each category of movies in a horizontal FlatList, with each item being a touchable movie poster. Movie posters use lazy loading for better performance.

The app uses a `categories.json` file (located at `src/mockups/categories.json`) to dynamically populate the landing page with different movie categories. This simulates a backend response and allows for easy configuration of which categories to display without modifying the code. Each category specifies a header (display name) and the corresponding TMDB API endpoint to fetch movies.

### Navigation Between Screens

Navigation is implemented using Expo Router, which provides file-based routing:

- `/app/index.tsx`: The landing page with movie lists
- `/app/movie/[id].tsx`: The movie details page

When a user taps on a movie, the app stores the selected movie in a global store and navigates to the movie details screen using dynamic routing. The movie ID is encoded in the URL path.

### Trailer Integration

Movie trailers are integrated using React Native WebView. When a user clicks the play button on a movie's backdrop, the app fetches the trailer URL from TMDB API and displays it in a modal using WebView. This approach offers better compatibility with various video platforms and formats compared to native video players.

## Design Decisions and Challenges

### Challenges

1. **Handling Different API Response Formats**: TMDB API returns different data structures for different endpoints. Creating a consistent movie model required careful mapping.

2. **Video Playback**: Implementing video playback in React Native presented challenges with different formats and platform-specific behaviors. After experimenting with various native video players (including expo-av), I ultimately chose WebView for its reliability and broad format support across platforms.

3. **Performance Optimization**: Ensuring smooth scrolling and transitions while loading movie posters required careful implementation of lazy loading and caching.

### Key Decisions

1. **State Management Choice**: Zustand was chosen over Redux for its simplicity and reduced boilerplate while still providing powerful state management capabilities.

2. **AsyncStorage for Persistence**: The app persists the last viewed movie in AsyncStorage to improve user experience when reopening the app. This addresses a common user behavior where someone browses a movie, closes the app, and later forgets which movie they were looking at. When they reopen the app, they're automatically taken to their last viewed movie.

3. **WebView for Trailers**: Using WebView to display trailers provides better compatibility with YouTube and other video platforms without requiring platform-specific implementations.

4. **Dynamic Categories Configuration**: The app uses a JSON configuration file (`src/mockups/categories.json`) to define the movie categories shown on the landing page. This simulates a backend API response and allows for easy modification of the displayed categories without code changes. It also demonstrates how the app could be connected to a real backend service that provides category configuration.

## Known Limitations

- Limited offline support - the app requires an internet connection for most features
- No user authentication or personalized recommendations
- Video player controls limited to what's provided by the video platform being embedded

## Future Improvements

- Add search functionality
- Implement movie filtering by genre
- Add user authentication and favorites
- Enhance offline support
- Add unit and integration tests
- Implement dark mode

