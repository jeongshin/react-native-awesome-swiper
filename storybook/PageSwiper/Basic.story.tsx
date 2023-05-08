import React, { useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, PageSwiper, PageProps } from '../../packages';

const Basic = () => {
  const ref = useRef<FlatList>(null);

  const { width, height } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const { top } = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

  const pages: Page[] = [
    { label: 'pink', Component: SamplePage },
    { label: 'purple', Component: SamplePage },
    { label: 'green', Component: SamplePage },
    { label: 'yellow', Component: SamplePage },
    { label: 'gray', Component: SamplePage },
    { label: 'black', Component: SamplePage },
    { label: 'skyblue', Component: SamplePage },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  return (
    <PageSwiper.FlatList
      ref={ref}
      pages={pages}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      renderHeader={() => (
        <View>
          <PageSwiper.AnimatedHeaderImage
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/6/60/IU_for_Chamisul_2021_campaign_09.png',
            }}
            style={{ width, height: width }}
          />
        </View>
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
        <Text
          key={index}
          style={{ fontSize: 100, fontWeight: 'bold', color: 'white' }}>
          {char}
        </Text>
      ))}
    </View>
  );
}

export default Basic;
