import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported for dynamic routes to work
export function App() {
  return <ExpoRoot context={require.context('./src/app')} />;
}

registerRootComponent(App);

