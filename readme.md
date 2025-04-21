# Movie Explorer App

A React Native mobile application that allows users to browse movies from The Movie Database (TMDB) API, view details, and watch trailers. Built with Expo and TypeScript.

## Development

This app was developed as part of a coding challenge and was completed in approximately 6 hours of focused development.

## Features

- Browse movies from different categories (popular, top-rated, upcoming, etc.)
- View detailed information about each movie
- Watch movie trailers directly in the app
- Explore similar and recommended movies
- Full search functionality with pagination and infinite scrolling
- Dedicated category screens with infinite scrolling
- Pull-to-refresh for updated content
- Smooth navigation between screens
- Dynamic category loading from configuration
- Responsive grid layouts for search and category results

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

- Node.js
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

### Key Components

#### MovieList Component

The `MovieList` component is a core UI element responsible for displaying a horizontal list of movies for a specific category. Key features include:

- Dynamic data loading from the API based on category endpoints
- Conditional navigation to category screens
- Loading and error state handling
- Customizable title display with optional navigation
- Optimized rendering with FlatList for performance

The component uses the Zustand store for state management, fetching movie data based on the category and displaying it in a horizontally scrollable list. It supports a `hideNavigation` prop that controls whether the category title is clickable, allowing for contextual usage throughout the app.

#### MovieItem Component

The `MovieItem` component renders individual movie cards within lists and grids. Features include:

- Responsive poster image loading with fallback placeholder
- Truncated title display
- Rating display with star icon
- Touch feedback for navigation to detail screen
- Consistent styling across the application

This component is used extensively throughout the app, ensuring a consistent look and feel for movie items regardless of where they appear.

### Movie Browsing Implementation

The app fetches and displays movies in a landing screen with multiple horizontal scrollable lists, each representing a different category (popular, top-rated, upcoming, etc.). Movie data is retrieved from TMDB API and stored in a Zustand store.

The `MovieList` component renders each category of movies in a horizontal FlatList, with each item being a touchable movie poster. Movie titles are clickable and navigate to a dedicated category screen that displays all movies in that category in a grid layout with infinite scrolling.

The app uses a `categories.json` file (located at `src/mockups/categories.json`) to dynamically populate the landing page with different movie categories. This simulates a backend response and allows for easy configuration of which categories to display without modifying the code. Each category specifies a header (display name) and the corresponding TMDB API endpoint to fetch movies.

### Search Implementation

The app features a robust search functionality that allows users to search for movies by title. The search component includes:

- A collapsible search bar with a toggle button
- Real-time loading indicators
- Infinite scrolling for search results
- Empty state handling for no results
- Error state handling for failed searches

Search results are displayed in a responsive grid layout with movie posters, titles, release dates, and ratings. The search functionality is powered by a dedicated search store that manages search state and pagination.

### Component Reusability

The app makes extensive use of reusable components to ensure consistency and reduce code duplication. The `MovieGrid` component is used in both search results and category screens, displaying movies in a consistent grid layout with infinite scrolling, loading states, and error handling.

### Navigation Between Screens

Navigation is implemented using Expo Router, which provides file-based routing:

- `/app/index.tsx`: The landing page with movie lists
- `/app/movie/[id].tsx`: The movie details page
- `/app/category/index.tsx`: Category-specific movie grid with infinite scrolling

When a user taps on a movie, the app stores the selected movie in a global store and navigates to the movie details screen using dynamic routing. The movie ID is encoded in the URL path.

### Trailer Integration

Movie trailers are integrated using React Native WebView. When a user clicks the play button on a movie's backdrop, the app fetches the trailer URL from TMDB API and displays it in a modal using WebView. This approach offers better compatibility with various video platforms and formats compared to native video players.

#### Trailer Playback Implementation

The app implements trailer playback through these steps:

1. **Fetching Trailer Data**: When a movie detail is loaded, the app fetches associated videos from the TMDB `/movie/{id}/videos` endpoint
2. **Modal-Based UI**: Trailers are displayed in a modal overlay that appears when the user taps the play button
3. **WebView Integration**: The YouTube embed URL is constructed and loaded in a React Native WebView component
4. **Responsive Design**: The WebView container adjusts to different device orientations and screen sizes
5. **Error Handling**: Fallback messaging is displayed if no trailer is available

This implementation provides several advantages:
- YouTube's native player controls are preserved
- Multiple video quality options are available to the user
- No need for additional video player libraries
- Consistent playback experience across iOS and Android

## Design Decisions and Challenges

### Challenges

1. **Handling Different API Response Formats**: TMDB API returns different data structures for different endpoints. Creating a consistent movie model required careful mapping.

2. **Video Playback**: Implementing video playback in React Native presented challenges with different formats and platform-specific behaviors. After experimenting with various native video players (including expo-av), I ultimately chose WebView for its reliability and broad format support across platforms.

3. **Performance Optimization**: Ensuring smooth scrolling and transitions while loading movie posters required careful implementation of lazy loading and caching.

4. **Infinite Scrolling**: Implementing efficient infinite scrolling for search results and category screens required careful state management and pagination handling.

### Key Decisions

1. **State Management Choice**: Zustand was chosen over Redux for its simplicity and reduced boilerplate while still providing powerful state management capabilities.

2. **AsyncStorage for Persistence**: The app persists the last viewed movie in AsyncStorage to improve user experience when reopening the app. This addresses a common user behavior where someone browses a movie, closes the app, and later forgets which movie they were looking at. When they reopen the app, they're automatically taken to their last viewed movie.

3. **WebView for Trailers**: Using WebView to display trailers provides better compatibility with YouTube and other video platforms without requiring platform-specific implementations.

4. **Dynamic Categories Configuration**: The app uses a JSON configuration file (`src/mockups/categories.json`) to define the movie categories shown on the landing page. This simulates a backend API response and allows for easy modification of the displayed categories without code changes. It also demonstrates how the app could be connected to a real backend service that provides category configuration.

5. **Component Modularization**: Creating reusable components like `MovieGrid` ensures UI consistency across different screens and reduces code duplication, making the codebase more maintainable.

## Known Limitations

- Limited offline support - the app requires an internet connection for most features
- No user authentication or personalized recommendations
- Video player controls limited to what's provided by the video platform being embedded

## Future Improvements

- Add filtering by genre
- Add user authentication and favorites
- Enhance offline support
- Add unit and integration tests
- Implement dark mode

