import React, { useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import InfiniteSwiper, {
  InfiniteSwiperRenderItem,
} from '../../packages/components/InfiniteSwiper';
import Typo from '../Typo';

const Basic = () => {
  const data = [
    'https://file.mk.co.kr/meet/neds/2022/06/image_readtop_2022_486646_16541333805062545.jpg',
    'http://file.mk.co.kr/meet/neds/2022/02/image_readtop_2022_104459_16440258224937758.jpg',
    'https://pbs.twimg.com/media/FoR4kypaMAA0Nm9?format=jpg&name=4096x4096',
  ];

  const renderItem: InfiniteSwiperRenderItem<string> = useCallback(
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
      <Typo.H3 text={'(web not supported 🥲)'} />
      <Typo.H1 text={'Horizontal'} />
      <InfiniteSwiper.Provider>
        <InfiniteSwiper.ScrollView
          data={data}
          autoPlay
          renderItem={renderItem}
          duration={2000}
          height={200}
        />
        <InfiniteSwiper.DotIndicator />
      </InfiniteSwiper.Provider>
      <Typo.H1 text={'Vertical'} />
      <InfiniteSwiper.Provider>
        <InfiniteSwiper.ScrollView
          data={data}
          autoPlay
          horizontal={false}
          renderItem={renderItem}
          duration={2000}
          height={200}
        />
        <InfiniteSwiper.DotIndicator />
      </InfiniteSwiper.Provider>
    </View>
  );
};

export default Basic;
