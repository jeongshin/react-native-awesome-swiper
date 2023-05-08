import React, { useCallback } from 'react';
import {
  Animated,
  FlatListProps,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import {
  FlatList,
  ListRenderItem,
  View,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import Provider from '../context/Provider';

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
  > {
  pages: T[];
  onActivePageIndexChange?: (index: number) => void;
  minimumViewTime?: number;
  itemVisiblePercentThreshold?: number;
  renderHeader?: () => React.ReactElement;
  containerScrollViewProps?: ScrollViewProps;
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
    ...props
  }: PageSwiperProps<T>,
  ref?: React.ForwardedRef<FlatList<T>>,
) {
  const { width } = useWindowDimensions();

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
    <Provider initialScrollIndex={initialScrollIndex || 0} width={width}>
      <ScrollView
        {...containerScrollViewProps}
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
      </ScrollView>
    </Provider>
  );
}

export default React.forwardRef(PageSwiper);
