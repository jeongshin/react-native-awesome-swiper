import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
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
import useDebouncedCallback from '../../../hooks/useDebounce';
import useInterval from '../../../hooks/useInterval';
import useUpdateInfiniteSwiperContext from '../hooks/useUpdateInfiniteSwiperContext';

export interface InfiniteSwiperProps<Item> extends ScrollViewProps {
  data: Item[];
  autoPlay?: boolean;
  duration?: number;
  width?: number;
  height?: number;
  initialScrollIndex?: number;
  refCallback?: (ref: ScrollView | Animated.LegacyRef<ScrollView>) => void;
  keyExtractor?: (item: Item, index: number) => string;
  renderItem: InfiniteSwiperRenderItem<Item>;
}

export type InfiniteSwiperRenderItem<Item> = (info: {
  item: Item;
  index: number;
}) => React.ReactElement;

/**
 * TODO:
 * - refactor to FlatList API for optimization
 * - web support
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
  initialScrollIndex: _initialScrollIndex,
  ...props
}: InfiniteSwiperProps<T>) {
  const [paused, setPaused] = useState(false);

  const { width: windowWidth } = useWindowDimensions();

  const width = _width ?? windowWidth;

  const initialScrollIndex = (_data?.length || 0) + (_initialScrollIndex || 0);

  const internalRef = useRef<ScrollView | null>(null);

  const [activeIndexInFloat, setAccurateIndexInFloat] =
    useState<number>(initialScrollIndex);

  const { debounceCallback } = useDebouncedCallback();

  const { scroll, setActiveIndex, setItemCount } =
    useUpdateInfiniteSwiperContext();

  const data = useMemo(() => cloneData(_data), [_data]);

  /**
   * handle scroll
   */
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
            debounceCallback(() => setAccurateIndexInFloat(index), 16);
          },
        },
      ),
    [width, height],
  );

  /**
   * init scroll position on mount
   */
  useLayoutEffect(() => {
    scroll.setValue(initialScrollIndex * (horizontal ? width : height));
  }, []);

  useLayoutEffect(() => {
    setItemCount(_data.length);
    setActiveIndex(Math.round(activeIndexInFloat) % _data.length);
  }, [_data.length, Math.round(activeIndexInFloat)]);

  /**
   * adjust position to center
   */
  useEffect(() => {
    if (!_data?.length) return;

    if (
      !shouldScrollToInitialPosition(
        Math.round(activeIndexInFloat),
        _data?.length,
      )
    ) {
      return;
    }

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
  }, [activeIndexInFloat, _data?.length]);

  /**
   * auto play logic
   */
  useInterval(
    useCallback(() => {
      if (!internalRef.current) return;

      const nextIndex = getNextIndex(
        data.length,
        Math.round(activeIndexInFloat),
      );

      internalRef.current.scrollTo(
        horizontal
          ? {
              x: nextIndex * width,
              y: 0,
              animated: true,
            }
          : {
              x: 0,
              y: nextIndex * height,
              animated: true,
            },
      );
    }, [data.length, activeIndexInFloat, height, width]),
    autoPlay ? (paused ? undefined : duration) : undefined,
  );

  return (
    <Animated.ScrollView
      showsHorizontalScrollIndicator={false}
      bounces={false}
      disableIntervalMomentum
      showsVerticalScrollIndicator={false}
      overScrollMode={'never'}
      {...props}
      /**
       * FIXME: react native issue scroll view ref
       * @see
       * https://github.com/facebook/react-native/pull/36472
       */
      ref={(ref: ScrollView | null) => {
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
    </Animated.ScrollView>
  );
}

export function getNextIndex(totalItemLength: number, activeIndex: number) {
  return (activeIndex + 1) % totalItemLength;
}

export function shouldScrollToInitialPosition(
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
