import React, { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Page, PageSwiper, PageProps } from '../../packages';

const Basic = () => {
  const ref = useRef<FlatList>(null);

  const { width, height } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const pages: Page[] = [
    { label: 'pink', Component: SamplePage },
    { label: 'purple', Component: SamplePage },
    { label: 'green', Component: SamplePage },
    { label: 'yellow', Component: SamplePage },
    { label: 'gray', Component: SamplePage },
    { label: 'black', Component: SamplePage },
    { label: 'skyblue', Component: SamplePage },
  ];

  return (
    <PageSwiper
      ref={ref}
      pages={pages}
      renderHeader={() => (
        <View style={{ width, height: width, backgroundColor: 'blue' }}></View>
      )}
      onActivePageIndexChange={setActiveIndex}
    />
  );
};

function SamplePage({ label }: PageProps) {
  return (
    <View
      style={{
        width: '100%',
        height: label.length * 300,
        backgroundColor: label,
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
      {label.split('').map((char, index) => (
        <Text key={index} style={{ fontSize: 40, fontWeight: 'bold' }}>
          {char}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Basic;
