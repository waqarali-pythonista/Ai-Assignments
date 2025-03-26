import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const defaultBreakpoints: Breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const useWindowSize = (breakpoints: Breakpoints = defaultBreakpoints) => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.sm;
  const isTablet = windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.md;
  const isDesktop = windowSize.width >= breakpoints.md;

  const isBreakpoint = (breakpoint: keyof Breakpoints) => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
    isBreakpoint,
  };
}; 