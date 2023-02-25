import React, { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { SwiperContext, SwiperContextType } from '.';

const Provider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [itemCount, setItemCount] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;

  const context = useMemo<SwiperContextType>(
    () => ({ itemCount, scrollX, setItemCount }),
    [itemCount],
  );

  return (
    <SwiperContext.Provider value={context}>{children}</SwiperContext.Provider>
  );
};

export default Provider;
