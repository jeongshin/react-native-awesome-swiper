import React, { useRef, useState } from 'react';
import type { FlatList } from 'react-native';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageSwiper } from '../../packages';

import type { Page, PageProps } from '../../packages';

const Basic = () => {
  const [activeIndex, setActiveIndex] = useState(3);

  const { top } = useSafeAreaInsets();

  const ref = useRef<FlatList<Page>>(null);

  const [count, setCount] = useState(0);

  const handlePress = () => setCount((p) => p + 1);

  const pages: Page[] = [
    { label: 'pink', Component: SamplePage },
    { label: 'purple', Component: SamplePage },
    {
      label: 'green',
      Component: <SampleElementPage count={count} onPress={handlePress} />,
    },
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
      <PageSwiper.MemoizedPageSwiper
        ref={ref}
        pages={pages}
        onActivePageIndexChange={setActiveIndex}
        initialScrollIndex={activeIndex}
      />
    </PageSwiper.Provider>
  );
};

function SampleElementPage({
  count,
  onPress,
}: {
  count: number;
  onPress: () => void;
}) {
  return (
    <View style={{ width: '100%' }}>
      <Pressable
        onPress={onPress}
        style={{
          width: 30,
          height: 30,
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>{count}</Text>
      </Pressable>
    </View>
  );
}

function SamplePage({ label }: PageProps) {
  return (
    <ScrollView
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
    </ScrollView>
  );
}

export default Basic;
