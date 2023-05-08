import React, { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from 'react-native';
import {
  FlatList,
  ListRenderItem,
  View,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { PageSwiperContext } from '../context';

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
  renderHeader?: () => React.ReactElement;
  containerScrollViewProps?: ScrollViewProps;
  onScrollX: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollY: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

function PageSwiper<T extends Page>(
  {
    pages,
    onActivePageIndexChange,
    minimumViewTime,
    itemVisiblePercentThreshold,
    initialScrollIndex,
    containerScrollViewProps,
    renderHeader,
    onScrollX,
    onScrollY,
    scrollEventThrottle,
    ...props
  }: PageSwiperProps<T>,
  ref?: React.ForwardedRef<FlatList<T>>,
) {
  const { width } = useWindowDimensions();

  const scrollX = useRef(
    new Animated.Value((initialScrollIndex || 0) * width),
  ).current;

  const scrollY = useRef(new Animated.Value(0)).current;

  const context = useMemo(() => ({ scrollX, scrollY }), []);

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

  const scrollYHandler = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: scrollY },
            },
          },
        ],
        {
          useNativeDriver: true,
          listener: (event: NativeSyntheticEvent<NativeScrollEvent>) =>
            onScrollY && onScrollY(event),
        },
      ),
    [onScrollY],
  );

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item: { Component, label }, index }) => {
      return (
        <View style={{ flex: 1, width }}>{Component({ label, index })}</View>
      );
    },
    [],
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
  > = useCallback(
    (event) => {
      props.onViewableItemsChanged && props.onViewableItemsChanged(event);
      const viewableItem = event.viewableItems.find((item) => item.isViewable);
      if (!viewableItem || typeof viewableItem.index !== 'number') return;
      onActivePageIndexChange && onActivePageIndexChange(viewableItem.index);
    },
    [props.onViewableItemsChanged],
  );

  return (
    <PageSwiperContext.Provider value={context}>
      <Animated.ScrollView
        {...containerScrollViewProps}
        onScroll={scrollYHandler}
        contentContainerStyle={StyleSheet.flatten([
          containerScrollViewProps?.contentContainerStyle,
          { flexGrow: 1 },
        ])}>
        {renderHeader && renderHeader()}
        <Animated.FlatList<T>
          // can override props
          disableIntervalMomentum
          decelerationRate={'fast'}
          bounces={false}
          {...props}
          // should not override props
          horizontal
          onScroll={scrollXHandler}
          scrollEventThrottle={scrollEventThrottle ?? 12}
          ref={ref as React.ForwardedRef<Animated.FlatList<T>>}
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
      </Animated.ScrollView>
    </PageSwiperContext.Provider>
  );
}

export default React.forwardRef(PageSwiper);
