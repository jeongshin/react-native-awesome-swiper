import { createContext } from 'react';
import type { Animated } from 'react-native';

export interface ContextType {
  itemCount: number;
  activeIndex: number;
  scroll: Animated.Value;
}

export interface UpdateContextType {
  scroll: Animated.Value;
  setItemCount: (index: number) => void;
  setActiveIndex: (index: number) => void;
}

export const SwiperContext = createContext<ContextType | null>(null);

export const UpdateSwiperContext = createContext<UpdateContextType | null>(
  null,
);
