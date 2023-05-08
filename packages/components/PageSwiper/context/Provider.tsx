import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { PageSwiperContext } from './context';

export interface ProviderProps {
  children?: React.ReactNode;
  initialScrollIndex: number;
  width: number;
}

const Provider: React.FC<ProviderProps> = ({
  children,
  initialScrollIndex,
  width,
}) => {
  const scrollX = useRef(
    new Animated.Value(initialScrollIndex * width),
  ).current;

  return (
    <PageSwiperContext.Provider value={scrollX}>
      {children}
    </PageSwiperContext.Provider>
  );
};

export default Provider;
