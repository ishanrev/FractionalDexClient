// @ts-nocheck

import { useRef, useEffect, useState } from 'react';
declare window as any
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


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
