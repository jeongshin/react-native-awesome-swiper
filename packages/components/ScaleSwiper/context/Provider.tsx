import React, { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  SwiperContext,
  SwiperContextType,
  UpdateSwiperContext,
} from './context';

const Provider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [itemCount, setItemCount] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;

  const context = useMemo<SwiperContextType>(
    () => ({ itemCount, scrollX, itemWidth, activeIndex }),
    [itemCount],
  );

  const update = useMemo<UpdateSwiperContext>(
    () => ({
      scrollX,
      setItemWidth,
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
