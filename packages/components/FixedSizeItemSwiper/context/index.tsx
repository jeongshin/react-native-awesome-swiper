import type { FC, ReactNode } from 'react';
import React from 'react';
import { createContext, useContext, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

export interface FixedSizeItemSwiperContext {
  scrollX: Animated.Value;
}

const Context = createContext<FixedSizeItemSwiperContext | null>(null);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const context: FixedSizeItemSwiperContext = useMemo(() => ({ scrollX }), []);

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export function useFixedSizeItemSwiperContext() {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error(
      '[react-native-awesome-swiper] cannot find context\nPlease render Provider\n<FixedSizeItemSwiper.Provider>{children}</FixedSizeItemSwiper.Provider>',
    );
  }

  return ctx;
}
