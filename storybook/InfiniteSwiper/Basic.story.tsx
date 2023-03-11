import React, { useCallback } from 'react';
import { ListRenderItem, View, Image, StyleSheet } from 'react-native';
import InfiniteSwiper from '../../packages/components/InfiniteSwiper';
import Typo from '../../packages/components/Typo';
import useSwiperRefCallback from '../../packages/hooks/useSwiperRefCallback';

const Basic = () => {
  const data = [
    'https://file.mk.co.kr/meet/neds/2022/06/image_readtop_2022_486646_16541333805062545.jpg',
    'http://file.mk.co.kr/meet/neds/2022/02/image_readtop_2022_104459_16440258224937758.jpg',
    'https://pbs.twimg.com/media/FoR4kypaMAA0Nm9?format=jpg&name=4096x4096',
  ];

  const { ref, refCallback } = useSwiperRefCallback<string>();

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item }) => (
      <View
        style={{ width: '100%', height: '100%', backgroundColor: 'skyblue' }}>
        <Image
          style={StyleSheet.absoluteFill}
          source={{ uri: item }}
          fadeDuration={0}
          resizeMode={'contain'}
        />
      </View>
    ),
    [],
  );

  return (
    <View>
      <Typo.H1 text={'Basic (web not supported)'} />
      <InfiniteSwiper.FlatList
        data={data}
        autoPlay
        renderItem={renderItem}
        height={200}
      />
    </View>
  );
};

export default Basic;
