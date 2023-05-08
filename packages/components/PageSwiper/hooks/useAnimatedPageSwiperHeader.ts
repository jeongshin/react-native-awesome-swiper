import { Animated, ImageProps, StyleSheet, ViewProps } from 'react-native';
import { usePageSwiperContext } from '../context';

export type AnimatedHeaderProps<T> = {
  scaleFrom?: number;
  scaleTo?: number;
  height: number;
} & T;

function useAnimatedPageSwiperHeader<T extends ViewProps | ImageProps>({
  height,
  scaleFrom = 1.4,
  scaleTo = 1.8,
  style,
}: AnimatedHeaderProps<T>): Animated.AnimatedProps<T> {
  const { scrollY } = usePageSwiperContext();

  return {
    style: StyleSheet.flatten([
      style,
      { height },
      {
        transform: [
          {
            scale: scrollY.interpolate({
              inputRange: [-height, 0, height],
              outputRange: [1, scaleFrom, scaleTo],
            }),
          },
        ],
      },
    ]),
  } as Animated.AnimatedProps<T>;
}

export default useAnimatedPageSwiperHeader;
