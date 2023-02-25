import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import ScaleSwiper from '..';
import Typo from '../../Typo';

const Basic = () => {
  const data = [
    'https://file.mk.co.kr/meet/neds/2022/06/image_readtop_2022_486646_16541333805062545.jpg',
    'http://file.mk.co.kr/meet/neds/2022/02/image_readtop_2022_104459_16440258224937758.jpg',
    'https://pbs.twimg.com/media/FoR4kypaMAA0Nm9?format=jpg&name=4096x4096',
    'https://img.hankyung.com/photo/202005/03.19553819.1-1200x.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/0f/IU_posing_for_Marie_Claire_Korea_March_2022_issue_03.jpg',
    'https://img.sbs.co.kr/newsnet/etv/upload/2022/11/16/30000804196_1280.jpg',
    'https://cdn.mhnse.com/news/photo/202211/155672_150022_5346.jpg',
    'http://image.newsis.com/2022/09/20/NISI20220920_0001088595_web.jpg',
    'https://dimg.donga.com/wps/NEWS/IMAGE/2022/12/30/117225530.2.jpg',
  ];

  return (
    <View>
      <Typo.H1 text={'Basic'} />
      <ScaleSwiper.Provider>
        <ScaleSwiper.FlatList
          data={data}
          transform={'scale'}
          itemHeight={(width) =>
            width * Platform.select({ web: 1.3, default: 2 })
          }
          renderItem={({ item }) => (
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 12,
                overflow: 'hidden',
              }}>
              <Image style={StyleSheet.absoluteFill} source={{ uri: item }} />
            </View>
          )}
        />
      </ScaleSwiper.Provider>
    </View>
  );
};

export default Basic;
