import React, { createContext, useContext, useMemo, useRef } from 'react';
import type { FlatList } from 'react-native';
import { Animated } from 'react-native';

export const PageSwiperContext = createContext<null | {
  scrollX: Animated.Value;
  scrollY: Animated.Value;
  flatListRef: React.RefObject<FlatList<any>>;
  onScrollY: (...args: any[]) => void;
}>(null);

export function usePageSwiperContext() {
  const context = useContext(PageSwiperContext);

  if (!context) {
    throw new Error(
      '[react-native-awesome-swiper] internal error this should not happen any time',
    );
  }

  return context;
}

export function Provider({
  children,
  useNativeDriver = true,
}: {
  children?: React.ReactNode;
  useNativeDriver?: boolean;
}) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollX = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList>(null);

  const onScrollY = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: scrollY },
            },
          },
        ],
        { useNativeDriver },
      ),
    [],
  );

  const context = useMemo(
    () => ({ scrollX, scrollY, flatListRef, onScrollY }),
    [],
  );

  return (
    <PageSwiperContext.Provider value={context}>
      {children}
    </PageSwiperContext.Provider>
  );
}
