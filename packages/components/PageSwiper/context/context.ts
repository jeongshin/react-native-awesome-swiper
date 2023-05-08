import { createContext, useContext } from 'react';
import { Animated } from 'react-native';

export const PageSwiperContext = createContext<null | Animated.Value>(null);

export function usePageSwiperContext() {
  const context = useContext(PageSwiperContext);

  if (!context) {
    throw new Error(
      '[react-native-awesome-swiper] this should not happen any time',
    );
  }

  return context;
}
