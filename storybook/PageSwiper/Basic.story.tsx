import React, { useRef, useState } from 'react';
import type { FlatList } from 'react-native';
import { Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageSwiper } from '../../packages';

import type { Page, PageProps } from '../../packages';

const Basic = () => {
  const [activeIndex, setActiveIndex] = useState(3);

  const { top } = useSafeAreaInsets();

  const ref = useRef<FlatList<Page>>(null);

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
    <PageSwiper.Provider>
      <PageSwiper.AnimatedLineTabs
        pages={pages}
        activeIndex={activeIndex}
        topInset={top}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
      <PageSwiper.PageFlatList
        ref={ref}
        pages={pages}
        onActivePageIndexChange={setActiveIndex}
        initialScrollIndex={activeIndex}
      />
    </PageSwiper.Provider>
  );
};

function SamplePage({ label }: PageProps) {
  return (
    <Animated.ScrollView
      style={[
        {
          width: '100%',
        },
      ]}>
      {label.split('').map((char, index) => (
        <Text
          key={index}
          style={{
            textAlign: 'center',
            borderWidth: 1,
            fontSize: 100,
            fontWeight: 'bold',
            color: 'white',
            borderColor: '#444',
            height: 300,
          }}>
          {char}
        </Text>
      ))}
    </Animated.ScrollView>
  );
}

export default Basic;
