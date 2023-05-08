import { useCallback, useState } from 'react';
import {
  Animated,
  ImageProps,
  LayoutChangeEvent,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { usePageSwiperContext } from '../context';

export type AnimatedHeaderProps<T> = {
  scaleFrom?: number;
  scaleTo?: number;
  height?: number;
} & T;

function useAnimatedPageSwiperHeader<T extends ViewProps | ImageProps>({
  height: fixedHeight,
  scaleFrom = 1.1,
  scaleTo = 1.3,
  onLayout,
  style,
}: AnimatedHeaderProps<T>): Animated.AnimatedProps<T> {
  const { scrollY } = usePageSwiperContext();

  const [height, setHeight] = useState(fixedHeight ?? 0);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setHeight(event.nativeEvent.layout.height);
      onLayout && onLayout(event);
    },
    [onLayout],
  );

  return {
    onLayout: fixedHeight ? onLayout : handleLayout,
    style: StyleSheet.flatten([
      style,
      fixedHeight ? { height: fixedHeight } : undefined,
      {
        transform: [
          {
            scale: scrollY.interpolate({
              inputRange: [0, height],
              outputRange: [scaleFrom, scaleTo],
            }),
          },
        ],
      },
    ]),
  } as Animated.AnimatedProps<T>;
}

export default useAnimatedPageSwiperHeader;
