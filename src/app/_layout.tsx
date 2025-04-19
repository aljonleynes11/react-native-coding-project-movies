import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="/movie"
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="movie/[id]"
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
} 
