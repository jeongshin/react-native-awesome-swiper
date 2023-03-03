import React, { useCallback, useLayoutEffect, useRef } from 'react';
import {
  FlatListProps,
  Animated,
  ListRenderItem,
  useWindowDimensions,
  Platform,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import useUpdateSwiperContext from '../../hooks/useUpdateSwiperContext';
import logger from '../../logger';
import { getItemLayoutFactory } from '../../utils';

export interface ScaleSwiperProps<Item>
  extends Animated.AnimatedProps<FlatListProps<Item>> {
  transform?: 'scale' | 'scaleX' | 'scaleY';
  slideCount?: number;
  verticalAlign?: 'top' | 'bottom' | 'center' | undefined;
  scaleDownRate?: number;
  itemHeight?: number | ((itemWidth: number) => number);
  initialScrollIndex?: number;
  refCallback?: (ref: FlatList<Item>) => void;
}

function ScaleSwiper<T>({
  transform = 'scale',
  initialScrollIndex = 0,
  scrollEventThrottle,
  decelerationRate,
  scaleDownRate = 0.14,
  refCallback,
  verticalAlign,
  contentContainerStyle,
  slideCount: _slideCount = 2,
  onScroll: _onScroll,
  getItemLayout: _getItemLayout,
  renderItem: _renderItem,
  contentOffset: _contentOffset,
  itemHeight: _itemHeight,
  ...props
}: ScaleSwiperProps<T>) {
  const { width } = useWindowDimensions();

  const { setItemCount, setItemWidth, scrollX, setActiveIndex } =
    useUpdateSwiperContext();

  const slideCount = Math.round(_slideCount / 2) * 2;

  const paddingX = (slideCount + 1) / 2 - 1;

  const itemWidth = getItemWidth(width, slideCount);

  const initialOffsetX = itemWidth * initialScrollIndex;

  const contentOffset = useRef({
    y: 0,
    ..._contentOffset,
    x: initialOffsetX,
  }).current;

  const getItemLayout = _getItemLayout ?? getItemLayoutFactory(itemWidth);

  const itemHeight =
    typeof _itemHeight === 'function' ? _itemHeight(itemWidth) : _itemHeight;

  const renderItem: ListRenderItem<T> = useCallback(
    ({ index, item, separators }) => {
      return (
        <Animated.View
          style={[
            {
              transform: [
                getScaleTransformStyle({
                  transform,
                  index,
                  itemWidth,
                  slideCount,
                  scaleDownRate,
                  scrollX,
                }),
                getVerticalTransformStyle({
                  transform,
                  index,
                  itemHeight,
                  itemWidth,
                  slideCount,
                  scaleDownRate,
                  scrollX,
                  verticalAlign,
                }),
              ],
            },
            { width: itemWidth },
            itemHeight ? { height: itemHeight } : undefined,
          ]}>
          {_renderItem && _renderItem({ item, index, separators })}
        </Animated.View>
      );
    },
    [_renderItem, itemHeight],
  );

  const handleScroll = useRef<Animated.FlatList['props']['onScroll']>(
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { x: scrollX },
          },
        },
      ],
      {
        useNativeDriver: Platform.select({ web: false, default: true }),
        listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          _onScroll && _onScroll(event);

          setActiveIndex(
            Math.round(event.nativeEvent.contentOffset.x / itemWidth),
          );
        },
      },
    ),
  ).current;

  useLayoutEffect(() => {
    if (typeof props.data?.length !== 'number') return;
    setItemCount(props.data.length);
    scrollX.setValue(initialOffsetX);
    setActiveIndex(initialScrollIndex);
  }, [props.data?.length]);

  useLayoutEffect(() => {
    setItemWidth(itemWidth);
  }, [itemWidth]);

  return (
    <Animated.FlatList
      {...props}
      // FIXME: type issue https://github.com/facebook/react-native/pull/36292
      ref={(ref) => refCallback && refCallback(ref as any)}
      horizontal
      pagingEnabled={Platform.select({ web: false, default: true })}
      renderItem={renderItem}
      onScroll={handleScroll}
      contentOffset={contentOffset}
      getItemLayout={getItemLayout}
      scrollEventThrottle={scrollEventThrottle ?? 16}
      decelerationRate={decelerationRate ?? 'fast'}
      snapToInterval={itemWidth}
      snapToAlignment={Platform.select({
        ios: 'start',
        android: 'center',
        web: 'start',
      })}
      contentContainerStyle={[
        {
          paddingLeft: paddingX * itemWidth,
          paddingRight: paddingX * itemWidth,
        },
        contentContainerStyle,
      ]}
    />
  );
}

export function getInputRange({
  itemWidth,
  index,
  slideCount,
}: {
  itemWidth: number;
  index: number;
  slideCount: number;
}): number[] {
  const size = slideCount + 1;
  const center = Math.floor(size / 2);

  return new Array(size)
    .fill(null)
    .map((_, itemIndex) => itemWidth * (index + (itemIndex - center)));
}

export function getScaleOutputRange({
  scaleDownRate,
  slideCount,
}: {
  scaleDownRate: number;
  slideCount: number;
}): number[] {
  const size = slideCount + 1;
  const center = Math.floor(size / 2);

  return new Array(size)
    .fill(null)
    .map((_, itemIndex) => 1 - Math.abs(itemIndex - center) * scaleDownRate);
}

export function getTranslateYOutputRange({
  scaleDownRate,
  slideCount,
  itemHeight,
  verticalAlign,
}: {
  slideCount: number;
  scaleDownRate: number;
  itemHeight: number;
  verticalAlign: 'top' | 'bottom';
}) {
  const size = slideCount + 1;
  const center = Math.floor(size / 2);

  if (verticalAlign === 'top') {
    return new Array(size).fill(null).map((_, itemIndex) => {
      const scale = 1 - scaleDownRate * Math.abs(itemIndex - center);
      return (itemHeight - itemHeight / scale) / 2;
    });
  }

  return new Array(size).fill(null).map((_, itemIndex) => {
    const scale = 1 - scaleDownRate * Math.abs(itemIndex - center);
    return -(itemHeight - itemHeight / scale) / 2;
  });
}

export function getItemWidth(windowWidth: number, slideCount: number) {
  if (slideCount <= 0) {
    logger.log('count can not be less or equal to zero');
    return windowWidth / 2;
  }

  return windowWidth / slideCount;
}

function getScaleTransformStyle({
  transform,
  scrollX,
  slideCount,
  itemWidth,
  index,
  scaleDownRate,
}: {
  transform: 'scale' | 'scaleX' | 'scaleY';
  scrollX: Animated.Value;
  slideCount: number;
  itemWidth: number;
  index: number;
  scaleDownRate: number;
}) {
  const config: Animated.InterpolationConfigType = {
    inputRange: getInputRange({
      slideCount,
      itemWidth,
      index,
    }),
    outputRange: getScaleOutputRange({
      slideCount,
      scaleDownRate,
    }),
    extrapolate: 'clamp',
  };

  if (transform === 'scaleY') {
    return { scaleY: scrollX.interpolate(config) };
  }

  if (transform === 'scaleX') {
    return { scaleX: scrollX.interpolate(config) };
  }

  return { scale: scrollX.interpolate(config) };
}

function getVerticalTransformStyle({
  transform,
  itemHeight,
  verticalAlign,
  scaleDownRate,
  scrollX,
  slideCount,
  itemWidth,
  index,
}: {
  transform: 'scale' | 'scaleX' | 'scaleY';
  itemHeight: number | undefined;
  verticalAlign: 'top' | 'bottom' | 'center' | undefined;
  scaleDownRate: number;
  scrollX: Animated.Value;
  index: number;
  itemWidth: number;
  slideCount: number;
}) {
  if (!verticalAlign || verticalAlign === 'center') {
    return { translateY: 0 };
  }

  if (transform !== 'scale' || !itemHeight) {
    logger.log('verticalAlign requires transform scale with fixed itemHeight');
    return { translateY: 0 };
  }

  return {
    translateY: scrollX.interpolate({
      inputRange: getInputRange({ itemWidth, index, slideCount }),
      outputRange: getTranslateYOutputRange({
        itemHeight,
        slideCount,
        scaleDownRate,
        verticalAlign,
      }),
      extrapolate: 'clamp',
    }),
  };
}

export default ScaleSwiper;
