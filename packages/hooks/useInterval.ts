import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay?: number | undefined) {
  const savedCallback = useRef(callback);

  const savedId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay || typeof delay !== 'number') {
      savedId.current && clearInterval(savedId.current);
      return;
    }

    savedId.current = setInterval(() => savedCallback.current(), delay);

    return () => {
      savedId.current && clearInterval(savedId.current);
    };
  }, [delay]);
}

export default useInterval;
