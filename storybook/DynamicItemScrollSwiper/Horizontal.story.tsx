import React, { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { DynamicItemScrollSwiper } from '../../packages';
import Typo from '../Typo';

const Basic = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = ['Hi', 'Jerry', 'FrontEnd', 'Developer', 'Apple', 'Coding'];

  return (
    <View>
      <Typo.H1 text={'Horizontal'} />
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

export default Basic;
