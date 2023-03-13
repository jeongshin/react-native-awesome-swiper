import { useCallback, useRef } from 'react';

const useRefCallback = <T>() => {
  const ref = useRef<T | null>(null);

  const refCallback = useCallback((_ref: T) => {
    ref.current = _ref;
  }, []);

  return {
    ref,
    refCallback,
  };
};

export default useRefCallback;
