import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, PageSwiper, PageProps } from '../../packages';

const Basic = () => {
  const { width, height } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const { top } = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

  const uri =
    'https://m.media-amazon.com/images/M/MV5BOTJhNzlmNzctNTU5Yy00N2YwLThhMjQtZDM0YjEzN2Y0ZjNhXkEyXkFqcGdeQXVyMTEwMTQ4MzU5._V1_FMjpg_UX1000_.jpg';

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
    <PageSwiper.Provider>
      <PageSwiper.PageScrollView stickyHeaderIndices={[1]}>
        {/* <PageSwiper.AnimatedHeaderImage
          source={{ uri }}
          height={width}
          style={{ width }}>
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            ]}>
            <Text
              style={{
                fontSize: 40,
                color: 'white',
                textAlign: 'center',
              }}>{`Super Mario\nBros`}</Text>
          </View>
        </PageSwiper.AnimatedHeaderImage> */}
        <PageSwiper.AnimatedLineTabs
          pages={pages}
          activeIndex={activeIndex}
          topInset={top}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
        <PageSwiper.PageFlatList
          pages={pages}
          onActivePageIndexChange={setActiveIndex}
        />
      </PageSwiper.PageScrollView>
    </PageSwiper.Provider>
  );
};

function SamplePage({ label }: PageProps) {
  return (
    <View
      style={[
        {
          // backgroundColor: label,
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
          }}>
          {char}
        </Text>
      ))}
    </View>
  );
}

export default Basic;
