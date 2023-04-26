import { useEffect } from 'react';

const useTimeout = (callback: () => void, delay?: number) => {
  useEffect(() => {
    const tick = () => {
      callback();
    };

    const id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [callback, delay]);
};

export default useTimeout;
