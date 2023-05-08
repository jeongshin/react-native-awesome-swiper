import React, { createContext, useContext, useMemo, useRef } from 'react';
import { Animated, FlatList } from 'react-native';

export const PageSwiperContext = createContext<null | {
  scrollX: Animated.Value;
  scrollY: Animated.Value;
  flatListRef: React.RefObject<FlatList<any>>;
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

export function Provider({ children }: { children?: React.ReactNode }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollX = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList>(null);

  const context = useMemo(() => ({ scrollX, scrollY, flatListRef }), []);

  return (
    <PageSwiperContext.Provider value={context}>
      {children}
    </PageSwiperContext.Provider>
  );
}
