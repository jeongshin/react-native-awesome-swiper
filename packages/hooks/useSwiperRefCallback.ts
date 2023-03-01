import { useCallback, useRef } from 'react';
import { FlatList } from 'react-native';

const useAnimatedFlatListRef = <T>() => {
  const ref = useRef<FlatList<T> | null>(null);

  const refCallback = useCallback((_ref: FlatList<T>) => {
    ref.current = _ref;
  }, []);

  return {
    ref,
    refCallback,
  };
};

export default useAnimatedFlatListRef;
