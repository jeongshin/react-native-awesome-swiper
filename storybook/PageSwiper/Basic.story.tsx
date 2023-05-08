import React, { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { DynamicItemScrollSwiper, PageSwiper } from '../../packages';

const Basic = () => {
  const ref = useRef<FlatList>(null);

  const { width, height } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const items = ['pink', 'purple', 'green', 'yellow', 'gray', 'black', 'white'];

  const pages: React.FC[] = items.map((bgColor) => {
    const Component = () => {
      return (
        <View
          style={{
            width: '100%',
            height: bgColor.length * 300,
            backgroundColor: bgColor,
            flex: 1,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          {bgColor.split('').map((char, index) => (
            <Text key={index} style={{ fontSize: 40, fontWeight: 'bold' }}>
              {char}
            </Text>
          ))}
        </View>
      );
    };
    return Component;
  });

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      stickyHeaderIndices={[1]}>
      <View style={{ width, height: width, backgroundColor: 'blue' }}></View>
      <DynamicItemScrollSwiper
        data={items}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 20 }}
        activeIndex={activeIndex}
        gap={10}
        viewOffset={40}
        renderItem={(item, index) => (
          <Pressable
            onPress={() => {
              setActiveIndex(index);
              ref.current?.scrollToIndex({ index, animated: true });
            }}
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
      <PageSwiper
        ref={ref}
        data={pages}
        onActivePageIndexChange={setActiveIndex}
      />
    </ScrollView>
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
