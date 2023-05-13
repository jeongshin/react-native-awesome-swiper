import React, { useCallback, useMemo } from 'react';
import {
  Animated,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { ListRenderItem, View, useWindowDimensions } from 'react-native';
import { usePageSwiperContext } from '../context';

export interface PageProps {
  label: string;
  index: number;
}

export interface Page {
  label: string;
  Component: React.FunctionComponent<PageProps>;
}

export interface PageSwiperProps<T>
  extends Omit<
    Partial<FlatListProps<T>>,
    | 'data'
    | 'renderItem'
    | 'viewabilityConfig'
    | 'getItemLayout'
    | 'snapToInterval'
    | 'onScroll'
  > {
  pages: T[];
  onActivePageIndexChange?: (index: number) => void;
  minimumViewTime?: number;
  itemVisiblePercentThreshold?: number;
  onScrollX?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

function PageSwiper<T extends Page>({
  pages,
  onActivePageIndexChange,
  minimumViewTime,
  itemVisiblePercentThreshold,
  initialScrollIndex,
  onScrollX,
  scrollEventThrottle,
  ...props
}: PageSwiperProps<T>) {
  const { width } = useWindowDimensions();

  const { scrollX, flatListRef } = usePageSwiperContext();

  const scrollXHandler = useMemo(
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
          listener: (event: NativeSyntheticEvent<NativeScrollEvent>) =>
            onScrollX && onScrollX(event),
        },
      ),
    [onScrollX],
  );

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item: { Component, label }, index }) => {
      return (
        <View
          style={{
            width,
            flex: 1,
            backgroundColor: label,
            // flexShrink: 1,
            // flexBasis: 'auto',
          }}>
          {Component({ label, index })}
        </View>
      );
    },
    [width],
  );

  const getItemLayout = useCallback(
    (_: T[] | null | undefined, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [],
  );

  const handleViewableItemChanged: NonNullable<
    FlatListProps<T>['onViewableItemsChanged']
  > = useCallback((event) => {
    props.onViewableItemsChanged && props.onViewableItemsChanged(event);
    const viewableItem = event.viewableItems.find((item) => item.isViewable);
    if (!viewableItem || typeof viewableItem.index !== 'number') return;
    onActivePageIndexChange && onActivePageIndexChange(viewableItem.index);
  }, []);

  return (
    <Animated.FlatList<T>
      // can override props
      disableIntervalMomentum
      decelerationRate={'fast'}
      nestedScrollEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      {...props}
      // should not override props
      horizontal
      onScroll={scrollXHandler}
      scrollEventThrottle={scrollEventThrottle ?? 12}
      ref={flatListRef}
      data={pages as Animated.WithAnimatedValue<T>[]}
      style={{ width }}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      snapToInterval={width}
      automaticallyAdjustContentInsets={false}
      initialScrollIndex={initialScrollIndex}
      viewabilityConfig={{
        itemVisiblePercentThreshold: itemVisiblePercentThreshold ?? 70,
        waitForInteraction: true,
        minimumViewTime: minimumViewTime ?? 200,
      }}
      onViewableItemsChanged={handleViewableItemChanged}
    />
  );
}

export default PageSwiper;
