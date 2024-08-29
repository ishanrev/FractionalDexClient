// @ts-nocheck
'use client'
import { useRef, useEffect, useState } from 'react';
declare global {
  interface Window {
    innerWidth:number,
    innerHeight:number
  }
}
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
  const [windowDimensions, setWindowDimensions] = useState<{
    width:number|null,
    height:number|null
  }>({
    width:null,
    height:null
  });

  useEffect(() => {
    function handleResize() {

      
      setWindowDimensions(getWindowDimensions());
    }

    
      // Set actual dimensions after mounting
      console.log("setting")
      setWindowDimensions(getWindowDimensions());
    

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
