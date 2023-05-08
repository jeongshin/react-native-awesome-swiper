import React from 'react';
import { Animated, Image, ImageProps, StyleSheet } from 'react-native';
import useAnimatedPageSwiperHeader, {
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
