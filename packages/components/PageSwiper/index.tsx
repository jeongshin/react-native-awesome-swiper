import React, { useCallback } from 'react';
import { FlatListProps } from 'react-native';
import {
  FlatList,
  ListRenderItem,
  View,
  useWindowDimensions,
} from 'react-native';

export interface PageSwiperProps<T extends React.FunctionComponent>
  extends Omit<
    Partial<FlatListProps<T>>,
    | 'data'
    | 'renderItem'
    | 'viewabilityConfig'
    | 'getItemLayout'
    | 'snapToInterval'
  > {
  data: T[];
  onActivePageIndexChange?: (index: number) => void;
  minimumViewTime?: number;
  itemVisiblePercentThreshold?: number;
}

function PageSwiper<T extends React.FunctionComponent>(
  {
    data,
    onActivePageIndexChange,
    minimumViewTime,
    itemVisiblePercentThreshold,
    initialScrollIndex = 0,
    ...props
  }: PageSwiperProps<T>,
  ref?: React.ForwardedRef<FlatList<T>>,
) {
  const { width } = useWindowDimensions();

  const renderItem: ListRenderItem<T> = useCallback(({ item }) => {
    return <View style={{ flex: 1, width }}>{item({})}</View>;
  }, []);

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
    <FlatList
      horizontal
      // onViewableItemsChanged={handleViewableItemChanged}
      disableIntervalMomentum
      decelerationRate={'fast'}
      {...props}
      ref={ref}
      data={data}
      style={{ width }}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      bounces={false}
      snapToInterval={width}
      automaticallyAdjustContentInsets={false}
      initialScrollIndex={initialScrollIndex}
      viewabilityConfig={{
        itemVisiblePercentThreshold: itemVisiblePercentThreshold ?? 70,
        waitForInteraction: true,
        minimumViewTime: minimumViewTime ?? 200,
      }}
    />
  );
}

export default React.forwardRef(PageSwiper);
