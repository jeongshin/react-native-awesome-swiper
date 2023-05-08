import React from 'react';
import { Animated, ImageProps } from 'react-native';
import useAnimatedPageSwiperHeader, {
  AnimatedHeaderProps,
} from '../hooks/useAnimatedPageSwiperHeader';

export type Props = AnimatedHeaderProps<ImageProps>;

const AnimatedHeaderImage: React.FC<Props> = (props) => {
  const animatedProps = useAnimatedPageSwiperHeader(props);
  return <Animated.Image {...props} {...animatedProps} />;
};

export default React.memo(AnimatedHeaderImage);
