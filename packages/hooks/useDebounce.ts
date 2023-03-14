import { useCallback, useRef } from 'react';

function useDebouncedCallback<T extends (...args: any[]) => void>() {
  const savedCb = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounceCallback = useCallback((cb: T, delay: number) => {
    if (savedCb.current) {
      clearTimeout(savedCb.current);
    }
    savedCb.current = setTimeout(cb, delay);
  }, []);

  return {
    debounceCallback,
  };
}

export default useDebouncedCallback;
