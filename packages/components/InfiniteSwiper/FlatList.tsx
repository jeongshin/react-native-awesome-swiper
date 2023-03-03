import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import useInterval from '../../hooks/useInterval';
import useUpdateSwiperContext from '../../hooks/useUpdateSwiperContext';
import { getItemLayoutFactory } from '../../utils';

export interface InfiniteSwiperProps<Item>
  extends Animated.AnimatedProps<FlatListProps<Item>> {
  autoPlay?: boolean;
  duration?: number;
  width?: number | 'fit-screen';
  height?: number;
  initialScrollIndex?: number;
  refCallback?: (ref: FlatList<Item>) => void;
}

function InfiniteSwiper<T>({
  data: _data,
  style,
  renderItem: _renderItem,
  width: _width = 'fit-screen',
  refCallback,
  onScroll: _onScroll,
  height = 200,
  autoPlay = true,
  duration = 2000,
  getItemLayout: _getItemLayout,
  initialScrollIndex = 0,
  ...props
}: InfiniteSwiperProps<T>) {
  const innerRef = useRef<FlatList | null>(null);

  const totalItems = useRef(0);

  const [activeIndex, setActiveIndex] = useState(initialScrollIndex);

  const { scrollX } = useUpdateSwiperContext();

  const { width: windowWidth } = useWindowDimensions();

  const itemWidth = _width === 'fit-screen' ? windowWidth : _width;

  const getItemLayout = _getItemLayout ?? getItemLayoutFactory(itemWidth);

  const data = useMemo(() => {
    const clonedData = cloneData(_data);
    totalItems.current = clonedData.length;
    return clonedData;
  }, [_data]);

  const renderItem: ListRenderItem<T> = useCallback(
    ({ item, index, separators }) => {
      return (
        <View style={{ width: itemWidth, height }}>
          {_renderItem && _renderItem({ item, index, separators })}
        </View>
      );
    },
    [_renderItem, itemWidth, height],
  );

  const handleScroll = useMemo<Animated.FlatList['props']['onScroll']>(
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
          useNativeDriver: Platform.select({ web: false, default: true }),
          listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            _onScroll && _onScroll(e);
            const index = e.nativeEvent.contentOffset.x / itemWidth;
            if (!Number.isInteger(index)) return;
            setActiveIndex(index);
          },
        },
      ),
    [itemWidth],
  );

  useEffect(() => {
    const { shouldAdjust, toIndex } = shouldAdjustPosition(
      activeIndex,
      totalItems.current,
    );

    if (!shouldAdjust) return;

    innerRef.current?.scrollToIndex({ index: toIndex, animated: false });
  }, [activeIndex]);

  useInterval(
    useCallback(() => {
      if (!innerRef.current) return;
      innerRef.current.scrollToIndex({
        index: getNextIndex(data.length, activeIndex),
        animated: true,
      });
    }, [data.length, activeIndex]),
    autoPlay ? duration : undefined,
  );

  return (
    <Animated.FlatList
      {...props}
      // FIXME: type issue https://github.com/facebook/react-native/pull/36292
      ref={(ref) => {
        innerRef.current = ref as any;
        refCallback && refCallback(ref as any);
      }}
      horizontal
      onScroll={handleScroll}
      data={data}
      pagingEnabled
      scrollEventThrottle={16}
      decelerationRate={'fast'}
      snapToInterval={itemWidth}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      style={[style, { width: itemWidth, height }]}
    />
  );
}

const CLONE_SETS = 3;

export function getNextIndex(totalItemLength: number, activeIndex: number) {
  return (activeIndex + 1) % totalItemLength;
}

export function shouldAdjustPosition(
  activeIndex: number,
  totalItems: number,
):
  | {
      shouldAdjust: true;
      toIndex: number;
    }
  | {
      shouldAdjust: false;
      toIndex: null;
    } {
  const isPivot = activeIndex === 0 || totalItems - totalItems / CLONE_SETS;

  if (isPivot)
    return {
      shouldAdjust: true,
      toIndex: totalItems - (totalItems / CLONE_SETS) * (CLONE_SETS - 1),
    };

  return { shouldAdjust: false, toIndex: null };
}

export function cloneData<T extends any[], P extends readonly any[]>(
  data: P | null | undefined,
): T {
  if (!data) return [] as unknown as T;

  const result = Array.from(data) as T;

  for (let i = 1; i < CLONE_SETS; i++) {
    result.push(...data);
  }

  return result;
}

export default InfiniteSwiper;
