import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle} from 'react-native';
import { View, Animated, Pressable } from 'react-native';
import useInfiniteSwiperContext from '../hooks/useInfiniteSwiperContext';

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
  const { itemCount, activeIndex } = useInfiniteSwiperContext();

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
                backgroundColor:
                  index === activeIndex % itemCount
                    ? activeDotColor
                    : inactiveDotColor,
              },
              {
                marginRight: index === items.length ? 0 : gap,
              },
            ]}></Animated.View>
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
