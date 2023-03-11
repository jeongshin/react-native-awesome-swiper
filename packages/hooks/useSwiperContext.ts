import { useContext } from 'react';
import { SwiperContext } from '../contexts';

const useSwiperContext = () => {
  const context = useContext(SwiperContext);

  if (!context) {
    throw Error(`useSwiperContext must be inside Swiper Context Provider`);
  }

  return context;
};

export default useSwiperContext;
