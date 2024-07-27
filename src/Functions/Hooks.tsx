// @ts-nocheck

import { useRef, useEffect } from 'react';

export const useDebounce = () => {
  const timeout = useRef();

  const debounce = (func, wait) => (...args) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => func(...args), wait);
  }

  useEffect(() => {
    return () => {
      if (!timeout.current) return;
      clearTimeout(timeout.current);
    }
  }, []);

  return { debounce }
}

export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};
  