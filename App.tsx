import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

export const App = require('expo-router/entry').default;

registerRootComponent(App);
