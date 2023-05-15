import React, { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  SwiperContext,
  UpdateSwiperContext,
} from './context';
import type {
  ContextType,
  UpdateContextType} from './context';

export interface ProviderProps {
  children?: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const scroll = useRef(new Animated.Value(0)).current;

  const [itemCount, setItemCount] = useState(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const context = useMemo<ContextType>(
    () => ({ itemCount, activeIndex, scroll }),
    [itemCount, activeIndex],
  );

  const update = useMemo<UpdateContextType>(
    () => ({
      scroll,
      setItemCount,
      setActiveIndex,
    }),
    [],
  );

  return (
    <SwiperContext.Provider value={context}>
      <UpdateSwiperContext.Provider value={update}>
        {children}
      </UpdateSwiperContext.Provider>
    </SwiperContext.Provider>
  );
};

export default Provider;
