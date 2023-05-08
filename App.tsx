import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StorybookUIRoot from './storybook';
import Basic from './storybook/PageSwiper/Basic.story';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Basic />
      </View>
    </SafeAreaProvider>
  );
}
