import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StorybookUIRoot from './storybook';

export default function App() {
  return (
    <SafeAreaProvider>
      <StorybookUIRoot />
    </SafeAreaProvider>
  );
}
