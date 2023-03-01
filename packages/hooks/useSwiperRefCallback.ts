import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

const useAnimatedFlatListRef = <T>() => {
  const ref = useRef<Animated.FlatList<T> | null>(null);

  const refCallback = useCallback((_ref: Animated.FlatList<T>) => {
    ref.current = _ref;
  }, []);

  return {
    ref,
    refCallback,
  };
};

export default useAnimatedFlatListRef;
