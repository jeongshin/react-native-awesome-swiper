import { useContext } from 'react';
import { SwiperContext } from '../context/context';

const useInfiniteSwiperContext = () => {
  const context = useContext(SwiperContext);

  if (!context) {
    throw Error('useInfiniteSwiperContext must be inside Provider');
  }

  return context;
};

export default useInfiniteSwiperContext;
