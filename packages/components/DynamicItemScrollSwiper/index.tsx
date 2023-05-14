import React, { useCallback, useLayoutEffect, useRef } from 'react';
import type { ScrollViewProps, ViewStyle } from 'react-native';
import { ScrollView, View } from 'react-native';
import useDynamicItemLayout from '../../hooks/useDynamicItemLayout';

export interface DynamicItemScrollSwiperProps<T> extends ScrollViewProps {
  data: T[];
  activeIndex: number;
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  gap?: number;
  viewOffset?: number;
  shouldScrollOnMount?: boolean;
}

function DynamicItemScrollSwiper<T>({
  activeIndex,
  data,
  renderItem,
  keyExtractor: givenKeyExtractor,
  gap = 0,
  horizontal = true,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  viewOffset = 20,
  shouldScrollOnMount = false,
  ...props
}: DynamicItemScrollSwiperProps<T>) {
  const ref = useRef<ScrollView>(null);

  const {
    mounted,
    layout,
    doneReLayout,
    getOffsetOfIndex,
    handleLayout,
    initialScrollDone,
  } = useDynamicItemLayout({
    data,
    horizontal,
  });

  const defaultKeyExtractor = useCallback(
    (_: T, index: number) => index.toString(),
    [],
  );

  const keyExtractor = givenKeyExtractor ?? defaultKeyExtractor;

  const getGapStyle = (index: number): ViewStyle => {
    if (!gap) return {};

    const isLastItem = index === data.length - 1;

    if (horizontal) {
      return isLastItem ? {} : { marginRight: gap };
    }

    return isLastItem ? {} : { marginBottom: gap };
  };

  const getInitialStyle = (): ViewStyle => {
    if (activeIndex !== 0 && !shouldScrollOnMount && !mounted) {
      return { opacity: 0 };
    }
    return {};
  };

  useLayoutEffect(() => {
    if (!doneReLayout) return;

    const offset =
      getOffsetOfIndex({ layout, index: activeIndex, gap }) - viewOffset;

    if (initialScrollDone.current) {
      ref.current?.scrollTo(
        horizontal ? { y: 0, x: offset } : { x: 0, y: offset },
      );
    } else {
      initialScrollDone.current = true;
      ref.current?.scrollTo(
        horizontal
          ? { y: 0, x: offset, animated: shouldScrollOnMount }
          : { x: 0, y: offset, animated: shouldScrollOnMount },
      );
    }
  }, [activeIndex, doneReLayout, viewOffset, horizontal, gap]);

  return (
    <ScrollView
      ref={ref}
      {...props}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}>
      {data.map((item, index) => (
        <View
          key={keyExtractor(item, index)}
          style={[getGapStyle(index), getInitialStyle()]}
          onLayout={(e) => handleLayout(e, index)}>
          {renderItem(item, index)}
        </View>
      ))}
    </ScrollView>
  );
}

export default DynamicItemScrollSwiper;
