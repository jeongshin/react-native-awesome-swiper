import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StorybookUIRoot from './storybook';
import Basic from './storybook/PageSwiper/Basic.story';

export default function App() {
  return (
    <SafeAreaProvider>
      <Basic />
    </SafeAreaProvider>
  );
}
