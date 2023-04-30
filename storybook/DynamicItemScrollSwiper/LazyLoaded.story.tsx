import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DynamicItemScrollSwiper } from '../../packages';
import Typo from '../Typo';

const LazyLoaded = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setItems(['Hi', 'Jerry', 'FrontEnd', 'Developer', 'Apple', 'Coding']);
    }, 2000);
  }, []);

  return (
    <View>
      <Typo.H1 text={'LazyLoaded'} />
      <DynamicItemScrollSwiper
        data={items}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 20 }}
        activeIndex={activeIndex}
        gap={10}
        viewOffset={40}
        renderItem={(item, index) => (
          <Pressable
            onPress={() => setActiveIndex(index)}
            style={[
              styles.item,
              activeIndex === index
                ? { backgroundColor: '#A4D0A4' }
                : { backgroundColor: '#eeeeee' },
            ]}>
            <Text>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LazyLoaded;
