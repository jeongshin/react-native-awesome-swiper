import { createContext } from 'react';
import { Animated } from 'react-native';

export interface SwiperContextType {
  itemCount: number;
  scrollX: Animated.Value;
  setItemCount: (count: number) => void;
}

export const SwiperContext = createContext<SwiperContextType | null>(null);
