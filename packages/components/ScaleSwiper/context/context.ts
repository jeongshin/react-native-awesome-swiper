import { createContext } from 'react';
import type { Animated } from 'react-native';

export interface SwiperContextType {
  itemCount: number;
  itemWidth: number;
  scrollX: Animated.Value;
  activeIndex: number;
}

export interface UpdateSwiperContext {
  scrollX: Animated.Value;
  setItemCount: (count: number) => void;
  setItemWidth: (width: number) => void;
  setActiveIndex: (index: number) => void;
}

export const SwiperContext = createContext<SwiperContextType | null>(null);

export const UpdateSwiperContext = createContext<UpdateSwiperContext | null>(
  null,
);
