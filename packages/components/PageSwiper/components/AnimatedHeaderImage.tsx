import React from 'react';
import type { ImageProps} from 'react-native';
import { Animated, Image, StyleSheet } from 'react-native';
import useAnimatedPageSwiperHeader from '../hooks/useAnimatedPageSwiperHeader';
import type {
  AnimatedHeaderProps,
} from '../hooks/useAnimatedPageSwiperHeader';

export interface Props extends AnimatedHeaderProps<ImageProps> {
  children?: React.ReactNode;
}

const AnimatedHeaderImage: React.FC<Props> = ({ children, ...props }) => {
  const animatedProps = useAnimatedPageSwiperHeader(props);
  return (
    <Animated.View {...animatedProps}>
      <Image {...props} style={StyleSheet.absoluteFill} />
      {children}
    </Animated.View>
  );
};

export default React.memo(AnimatedHeaderImage);
