import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View, Animated, StyleSheet, Pressable } from 'react-native';
import useSwiperContext from '../hooks/useSwiperContext';

export interface DotIndicatorProps {
  onPress?: (index: number) => void;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  activeDotColor?: string;
  inactiveDotColor?: string;
  dotSize?: number;
  borderRadius?: number;
}

const DotIndicator: React.FC<DotIndicatorProps> = ({
  style,
  gap = 4,
  onPress,
  activeDotColor = '#222222',
  inactiveDotColor = '#cccccc',
  dotSize = 14,
  borderRadius = 14,
}) => {
  const { itemCount, itemWidth, scrollX } = useSwiperContext();

  const items = useMemo(() => new Array(itemCount).fill(null), [itemCount]);

  return (
    <View style={style}>
      {items.map((_, index) => (
        <Pressable onPress={() => onPress && onPress(index)} key={index}>
          <Animated.View
            style={[
              {
                width: dotSize,
                height: dotSize,
                borderRadius,
                backgroundColor: activeDotColor,
              },
              {
                marginRight: index === items.length ? 0 : gap,
                transform: [
                  {
                    scale: scrollX.interpolate({
                      inputRange: [
                        itemWidth * (index - 1),
                        itemWidth * index,
                        itemWidth * (index + 1),
                      ],
                      outputRange: [0.8, 1, 0.8],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <Animated.View
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius,
                backgroundColor: inactiveDotColor,
                ...StyleSheet.absoluteFillObject,
                opacity: scrollX.interpolate({
                  inputRange: [
                    itemWidth * (index - 1),
                    itemWidth * index,
                    itemWidth * (index + 1),
                  ],
                  outputRange: [1, 0, 1],
                  extrapolate: 'clamp',
                }),
              }}
            />
          </Animated.View>
        </Pressable>
      ))}
    </View>
  );
};

DotIndicator.defaultProps = {
  style: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
};

export default DotIndicator;
