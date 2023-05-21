import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import React, { useCallback, useMemo } from 'react';
import type {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewabilityConfig,
} from 'react-native';
import type { ListRenderItem } from 'react-native';
import { Animated } from 'react-native';
import { View, useWindowDimensions } from 'react-native';
import { usePageSwiperContext } from '../context';

export interface PageProps<T = unknown> {
  label: string;
  index: number;
  data: T;
}

export interface Page<T = unknown> {
  Component: React.FunctionComponent<PageProps> | React.ReactElement;
  label: string;
  data?: T;
}

export interface PageSwiperProps<T>
  extends Omit<
      Partial<FlatListProps<T>>,
      | 'data'
      | 'renderItem'
      | 'viewabilityConfig'
      | 'getItemLayout'
      | 'snapToInterval'
    >,
    ViewabilityConfig {
  pages: T[];
  onActivePageIndexChange?: (index: number) => void;
  renderItem?: ListRenderItem<T>;
}

function PageSwiper<P, T extends Page<P>>(
  {
    pages,
    onActivePageIndexChange,
    minimumViewTime,
    itemVisiblePercentThreshold,
    initialScrollIndex,
    onScroll,
    scrollEventThrottle,
    keyExtractor,
    waitForInteraction = true,
    renderItem: givenRenderItem,
    ...props
  }: PageSwiperProps<T>,
  ref?: ForwardedRef<FlatList<T>>,
) {
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
            onScroll && onScroll(event),
        },
      ),
    [onScroll],
  );

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item: { Component, label, data }, index }) => {
      return (
        <View
          style={{
            width,
            flex: 1,
          }}>
          {typeof Component === 'function' ? (
            <Component label={label} index={index} data={data!} />
          ) : (
            Component
          )}
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
      keyExtractor={
        keyExtractor ? keyExtractor : (item, index) => `${item.label}-${index}`
      }
      scrollEventThrottle={scrollEventThrottle ?? 12}
      ref={(_ref) => {
        //@ts-ignore
        if (ref) ref.current = _ref;
        //@ts-ignore
        flatListRef.current = _ref;
      }}
      data={pages as Animated.WithAnimatedValue<T>[]}
      style={{ width }}
      renderItem={givenRenderItem ?? renderItem}
      getItemLayout={getItemLayout}
      snapToInterval={width}
      automaticallyAdjustContentInsets={false}
      initialScrollIndex={initialScrollIndex}
      viewabilityConfig={{
        itemVisiblePercentThreshold: itemVisiblePercentThreshold ?? 70,
        waitForInteraction,
        minimumViewTime: minimumViewTime ?? 200,
      }}
      onViewableItemsChanged={handleViewableItemChanged}
    />
  );
}
const ForwardedPageSwiper = forwardRef(PageSwiper);

const MemoizedPageSwiper = React.memo(
  ForwardedPageSwiper,
) as typeof ForwardedPageSwiper;

export { MemoizedPageSwiper };

export default ForwardedPageSwiper;
