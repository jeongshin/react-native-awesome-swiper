import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent} from 'react-native';
import {
  Animated,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import useInterval from '../../../hooks/useInterval';
import { getItemLayoutFactory } from '../../../utils';

/**
 * TODO: use flat-list when android flickering issue resolved
 */
export interface InfiniteSwiperProps<Item> extends FlatListProps<Item> {
  data: Item[];
  autoPlay?: boolean;
  duration?: number;
  width?: number;
  height?: number;
  initialScrollIndex?: number;
  refCallback?: (ref: FlatList<Item>) => void;
}

/**
 * TODO:
 *
 * - add docs
 * - web support
 * - support vertical
 * - android conditional flickering
 * - add indicator
 */
function InfiniteSwiper<T>({
  data: _data,
  style,
  renderItem: _renderItem,
  width: _width,
  refCallback,
  decelerationRate,
  onScroll: _onScroll,
  height = 200,
  autoPlay = false,
  duration = 4000,
  horizontal = true,
  getItemLayout: _getItemLayout,
  onScrollBeginDrag,
  onScrollEndDrag,
  initialScrollIndex = _data?.length || 0,
  ...props
}: InfiniteSwiperProps<T>) {
  const [paused, setPaused] = useState(false);

  const { width: windowWidth } = useWindowDimensions();

  const width = _width ?? windowWidth;

  const internalRef = useRef<FlatList | null>(null);

  const [activeIndex, setAccurateActiveIndex] =
    useState<number>(initialScrollIndex);

  const scroll = useRef(new Animated.Value(initialScrollIndex * width)).current;

  const getItemLayout = _getItemLayout ?? getItemLayoutFactory(width);

  const data = useMemo(() => cloneData(_data), [_data]);

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item, index, separators }) => {
      return (
        <View style={{ width, height }}>
          {_renderItem && _renderItem({ item, index, separators })}
        </View>
      );
    },
    [_renderItem, width, height],
  );

  const handleScroll = useMemo<Animated.FlatList['props']['onScroll']>(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: scroll },
            },
          },
        ],
        {
          useNativeDriver: Platform.select({ web: false, default: true }),
          listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            _onScroll && _onScroll(e);
            const offset = e.nativeEvent.contentOffset.x;
            const index = offset / width;
            setAccurateActiveIndex((prev) =>
              getIndexConsiderErrorRange(index, prev),
            );
          },
        },
      ),
    [width],
  );

  useEffect(() => {
    if (!_data?.length) return;

    const { shouldAdjust, toIndex } = shouldAdjustPosition(
      activeIndex,
      _data?.length,
    );

    if (!shouldAdjust) return;

    internalRef.current?.scrollToIndex({
      index: toIndex,
      viewOffset: 0,
      viewPosition: 0,
      animated: false,
    });
  }, [activeIndex, _data?.length]);

  useInterval(
    useCallback(() => {
      if (!internalRef.current) return;
      internalRef.current.scrollToIndex({
        index: getNextIndex(data.length, activeIndex),
        animated: true,
      });
    }, [data.length, activeIndex]),
    autoPlay ? (paused ? undefined : duration) : undefined,
  );

  return (
    <Animated.FlatList
      showsHorizontalScrollIndicator={false}
      bounces={false}
      {...props}
      // @ts-ignore
      data={data}
      // FIXME: type issue https://github.com/facebook/react-native/pull/36292
      ref={(ref) => {
        internalRef.current = ref as any;
        refCallback && refCallback(ref as any);
      }}
      horizontal={horizontal}
      onScroll={handleScroll}
      pagingEnabled
      initialScrollIndex={initialScrollIndex}
      scrollEventThrottle={16}
      decelerationRate={decelerationRate ?? 0.9}
      snapToInterval={width}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      style={[style, { width, height }]}
      onScrollBeginDrag={(e) => {
        onScrollBeginDrag && onScrollBeginDrag(e);
        setPaused(true);
      }}
      onScrollEndDrag={(e) => {
        onScrollEndDrag && onScrollEndDrag(e);
        setPaused(false);
      }}
    />
  );
}

function getIndexConsiderErrorRange(nextValue: number, prevValue: number) {
  const error = Math.abs((Math.round(nextValue) - nextValue) * 100);

  if (error < 1) {
    return Math.round(nextValue);
  }

  return prevValue;
}

export function getNextIndex(totalItemLength: number, activeIndex: number) {
  return (activeIndex + 1) % totalItemLength;
}

export function shouldAdjustPosition(
  activeIndex: number,
  itemCount: number,
):
  | {
      shouldAdjust: true;
      toIndex: number;
    }
  | {
      shouldAdjust: false;
      toIndex: null;
    } {
  const isPivot = activeIndex === 0 || activeIndex === itemCount * 2;

  if (isPivot) {
    return {
      shouldAdjust: true,
      toIndex: itemCount,
    };
  }

  return { shouldAdjust: false, toIndex: null };
}

export function cloneData<T extends any[]>(data: T) {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (data.length === 1) return data;
  return [...data, ...data, data[0]];
}

export default InfiniteSwiper;
