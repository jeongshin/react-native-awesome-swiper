import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native';

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

  const initialScrollDone = useRef(false);

  const [mounted, setMounted] = useState(false);

  const [doneReLayout, setDoneReLayout] = useState(false);

  const layout = useRef(new Map<number, number>()).current;

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
  }, [activeIndex, doneReLayout, viewOffset, horizontal]);

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
          onLayout={(e) => {
            const dimension = horizontal
              ? e.nativeEvent.layout.width
              : e.nativeEvent.layout.height;

            layout.set(index, dimension);

            const everyLayoutDone = data.every((_, idx) => layout.has(idx));

            setDoneReLayout(everyLayoutDone);

            setMounted((prev) => prev || everyLayoutDone);
          }}>
          {renderItem(item, index)}
        </View>
      ))}
    </ScrollView>
  );
}

export function getOffsetOfIndex({
  layout,
  index,
  gap,
}: {
  layout: Map<number, number>;
  index: number;
  gap: number;
}): number {
  // [[0, 108.33332824707031], [1, 61], [2, 46.00001525878906], [3, 76], [4, 86]]
  const itemLayout = [...layout.entries()].sort().map(([_, val]) => val);

  return itemLayout.reduce((acc, offset, currIndex) => {
    if (currIndex >= index) return acc;
    // acc + offset + gap
    return acc + offset + gap;
  }, 0);
}

export default DynamicItemScrollSwiper;
