import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

const App = require('expo-router/entry').default;

registerRootComponent(App);
