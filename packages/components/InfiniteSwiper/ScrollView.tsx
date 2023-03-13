import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  useWindowDimensions,
  View,
} from 'react-native';
import useDebouncedCallback from '../../hooks/useDebounce';
import useInterval from '../../hooks/useInterval';

export interface InfiniteSwiperProps<Item> extends ScrollViewProps {
  data: Item[];
  autoPlay?: boolean;
  duration?: number;
  width?: number;
  height?: number;
  initialScrollIndex?: number;
  refCallback?: (ref: ScrollView) => void;
  keyExtractor?: (item: Item, index: number) => string;
  renderItem: InfiniteSwiperRenderItem<Item>;
}

export type InfiniteSwiperRenderItem<Item> = (info: {
  item: Item;
  index: number;
}) => React.ReactElement;

/**
 * TODO:
 *
 * - add docs
 * - web support
 * - support vertical
 * - add indicator
 */
function InfiniteSwiper<T>({
  data: _data,
  style,
  renderItem,
  width: _width,
  refCallback,
  decelerationRate,
  onScroll: _onScroll,
  height = 200,
  autoPlay = false,
  duration = 4000,
  horizontal = true,
  keyExtractor,
  onScrollBeginDrag,
  onScrollEndDrag,
  initialScrollIndex = _data?.length || 0,
  ...props
}: InfiniteSwiperProps<T>) {
  const [paused, setPaused] = useState(false);

  const { width: windowWidth } = useWindowDimensions();

  const width = _width ?? windowWidth;

  const internalRef = useRef<ScrollView | null>(null);

  const [activeIndex, setAccurateIndex] = useState<number>(initialScrollIndex);

  const { debounceCallback } = useDebouncedCallback();

  const scroll = useRef(new Animated.Value(initialScrollIndex * width)).current;

  const data = useMemo(() => cloneData(_data), [_data]);

  const handleScroll = useMemo<Animated.FlatList['props']['onScroll']>(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { [horizontal ? 'x' : 'y']: scroll },
            },
          },
        ],
        {
          useNativeDriver: false,
          listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            _onScroll && _onScroll(e);

            const offset = horizontal
              ? e.nativeEvent.contentOffset.x
              : e.nativeEvent.contentOffset.y;

            const index = offset / (horizontal ? width : height);
            debounceCallback(() => setAccurateIndex(index), 16);
          },
        },
      ),
    [width, height],
  );

  useEffect(() => {
    if (!_data?.length) return;

    const shouldAdjust = shouldAdjustPosition(
      Math.round(activeIndex),
      _data?.length,
    );

    if (!shouldAdjust) return;

    internalRef.current?.scrollTo(
      horizontal
        ? {
            x: width * initialScrollIndex,
            y: 0,
            animated: false,
          }
        : {
            x: 0,
            y: height * initialScrollIndex,
            animated: false,
          },
    );
  }, [activeIndex, _data?.length]);

  useInterval(
    useCallback(() => {
      if (!internalRef.current) return;

      internalRef.current.scrollTo(
        horizontal
          ? {
              x: getNextIndex(data.length, activeIndex) * width,
              y: 0,
              animated: true,
            }
          : {
              x: 0,
              y: getNextIndex(data.length, activeIndex) * height,
              animated: true,
            },
      );
    }, [data.length, activeIndex, height, width]),
    autoPlay ? (paused ? undefined : duration) : undefined,
  );

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      bounces={false}
      disableIntervalMomentum
      showsVerticalScrollIndicator={false}
      overScrollMode={'never'}
      {...props}
      ref={(ref) => {
        if (!ref) return;
        internalRef.current = ref;
        refCallback && refCallback(ref);
      }}
      contentOffset={
        horizontal
          ? { x: initialScrollIndex * width, y: 0 }
          : { x: 0, y: initialScrollIndex * height }
      }
      horizontal={horizontal}
      onScroll={handleScroll}
      scrollEventThrottle={8}
      decelerationRate={decelerationRate ?? 'fast'}
      snapToOffsets={data.map(
        (_, index) => index * (horizontal ? width : height),
      )}
      style={[style, { width, height }]}
      onScrollBeginDrag={(e) => {
        onScrollBeginDrag && onScrollBeginDrag(e);
        setPaused(true);
      }}
      onScrollEndDrag={(e) => {
        onScrollEndDrag && onScrollEndDrag(e);
        setPaused(false);
      }}>
      {data.map((item, index) => {
        return (
          <View
            style={{ width, height }}
            key={keyExtractor ? keyExtractor(item, index) : index.toString()}>
            {renderItem && renderItem({ item, index })}
          </View>
        );
      })}
    </ScrollView>
  );
}

export function getNextIndex(totalItemLength: number, activeIndex: number) {
  return (activeIndex + 1) % totalItemLength;
}

export function shouldAdjustPosition(
  activeIndex: number,
  itemCount: number,
): boolean {
  return activeIndex === 0 || activeIndex === itemCount * 2;
}

export function cloneData<T extends any[]>(data: T) {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (data.length === 1) return data;
  return [...data, ...data, data[0]];
}

export default InfiniteSwiper;
