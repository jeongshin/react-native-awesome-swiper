import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DynamicItemScrollSwiper } from '../../packages';
import Typo from '../Typo';

const Basic = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  // 'Hi', 'Jerry', 'FrontEnd', 'Developer', 'Apple', 'Coding'
  const items = [
    {
      text: 'Hi',
      height: 200,
    },
    {
      text: 'Jerry',
      height: 240,
    },
    {
      text: 'FrontEnd',
      height: 150,
    },
    {
      text: 'Developer',
      height: 180,
    },
    {
      text: 'Apple',
      height: 170,
    },
    {
      text: 'Coding',
      height: 150,
    },
  ];

  return (
    <View>
      <Typo.H1 text={'Horizontal'} />
      <DynamicItemScrollSwiper
        data={items}
        horizontal={false}
        contentContainerStyle={{ paddingVertical: 20, width: 100 }}
        activeIndex={activeIndex}
        gap={10}
        viewOffset={40}
        renderItem={({ text, height }, index) => (
          <Pressable
            onPress={() => setActiveIndex(index)}
            style={[
              styles.item,
              activeIndex === index
                ? { backgroundColor: '#A4D0A4' }
                : { backgroundColor: '#eeeeee' },
              { height },
            ]}>
            <Text>{text}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Basic;
