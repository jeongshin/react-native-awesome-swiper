import React, { useCallback } from 'react';
import { ListRenderItem, View, Image, StyleSheet } from 'react-native';
import InfiniteSwiper from '../../packages/components/InfiniteSwiper';
import Typo from '../../packages/components/Typo';
import useSwiperRefCallback from '../../packages/hooks/useSwiperRefCallback';

const Basic = () => {
  const data = [
    'https://file.mk.co.kr/meet/neds/2022/06/image_readtop_2022_486646_16541333805062545.jpg',
    'http://file.mk.co.kr/meet/neds/2022/02/image_readtop_2022_104459_16440258224937758.jpg',
  ];

  const { ref, refCallback } = useSwiperRefCallback<string>();

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item }) => (
      <Image style={StyleSheet.absoluteFill} source={{ uri: item }} />
    ),
    [],
  );

  return (
    <View>
      <Typo.H1 text={'Basic'} />
      <InfiniteSwiper.Provider>
        <InfiniteSwiper.FlatList
          data={data}
          renderItem={renderItem}
          width={'fit-screen'}
          height={200}
        />
      </InfiniteSwiper.Provider>
    </View>
  );
};

export default Basic;
