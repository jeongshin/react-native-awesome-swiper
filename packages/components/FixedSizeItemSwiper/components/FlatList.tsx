import React, { memo, useCallback, useLayoutEffect, useMemo } from 'react';
import { forwardRef } from 'react';
import type { ReactElement, RefObject } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import type {
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { getItemLayoutFactory } from '../../../utils';
import { useFixedSizeItemSwiperContext } from '../context';

export type FixedSizeListRenderItem<T> = (info: {
  item: T;
  index: number;
}) => ReactElement;

export interface FixedSizeItemSwiperProps<T> extends FlatListProps<T> {
  data: T[];
  renderItem: FixedSizeListRenderItem<T>;
  size: number;
  gap?: number;
  paddingHorizontal?: number;
  initialScrollIndex?: number;
}

function FixedSizeItemSwiper<T>(
  {
    data,
    size,
    renderItem: givenRenderItem,
    getItemLayout: givenGetItemLayout,
    gap = 10,
    paddingHorizontal = 20,
    contentContainerStyle,
    scrollEventThrottle = 12,
    onScroll,
    initialScrollIndex = 0,
    ...props
  }: FixedSizeItemSwiperProps<T>,
  ref?: RefObject<FlatList>,
) {
  const itemCount = data.length;

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => {
      const isLastItem = itemCount - 1 === index;
      return (
        <View style={{ width: size, marginRight: isLastItem ? 0 : gap }}>
          {givenRenderItem({ item, index })}
        </View>
      );
    },
    [size, givenRenderItem, gap, itemCount],
  );

  const getItemLayout = useMemo(() => getItemLayoutFactory<T>(size), [size]);

  const { scrollX } = useFixedSizeItemSwiperContext();

  const handleScroll = useMemo<Animated.FlatList['props']['onScroll']>(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: scrollX },
            },
          },
        ],
        {
          useNativeDriver: true,
          listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            onScroll && onScroll(e);
          },
        },
      ),
    [onScroll],
  );

  useLayoutEffect(() => {
    scrollX.setValue(paddingHorizontal + initialScrollIndex * size);
  }, []);

  return (
    <Animated.FlatList
      ref={ref}
      horizontal
      //@ts-ignore type error
      data={data}
      renderItem={renderItem}
      scrollEventThrottle={scrollEventThrottle}
      getItemLayout={givenGetItemLayout ?? getItemLayout}
      contentContainerStyle={StyleSheet.flatten([
        contentContainerStyle,
        { paddingHorizontal },
      ])}
      onScroll={handleScroll}
      {...props}
    />
  );
}

export default forwardRef(
  memo(FixedSizeItemSwiper),
) as typeof FixedSizeItemSwiper;
