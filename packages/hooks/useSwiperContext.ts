import { useContext } from 'react';
import { SwiperContext } from '../contexts';

const useSwiperContext = () => {
  const context = useContext(SwiperContext);

  if (!context) {
    throw Error('useSwiperContext must be inside Provider');
  }

  return context;
};

export default useSwiperContext;
