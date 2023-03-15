import { useContext } from 'react';
import { UpdateSwiperContext } from '../context/context';

const useUpdateInfiniteSwiperContext = () => {
  const context = useContext(UpdateSwiperContext);

  if (!context) {
    throw Error('useUpdateInfiniteSwiperContext must be inside Provider');
  }

  return context;
};

export default useUpdateInfiniteSwiperContext;
