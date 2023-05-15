import React, { useMemo } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps} from 'react-native';
import {
  Animated,
  StyleSheet,
} from 'react-native';
import { usePageSwiperContext } from '../context';

export interface PageScrollViewProps extends ScrollViewProps {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const PageScrollView: React.FC<PageScrollViewProps> = ({
  onScroll,
  contentContainerStyle,
  children,
  style,
  ...props
}) => {
  const { scrollY } = usePageSwiperContext();

  const scrollYHandler = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: scrollY },
            },
          },
        ],
        {
          useNativeDriver: true,
          listener: (event: NativeSyntheticEvent<NativeScrollEvent>) =>
            onScroll && onScroll(event),
        },
      ),
    [onScroll],
  );

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      {...props}
      onScroll={scrollYHandler}
      style={StyleSheet.flatten([{ overflow: 'visible' }, style])}
      contentContainerStyle={StyleSheet.flatten([
        contentContainerStyle,
        { flexGrow: 1 },
      ])}>
      {children}
    </Animated.ScrollView>
  );
};

export default PageScrollView;
