import { useEffect, useLayoutEffect, useRef } from 'react';

function useInterval(callback: () => void, delay?: number | undefined) {
  const savedCallback = useRef(callback);

  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay || typeof delay !== 'number') {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
