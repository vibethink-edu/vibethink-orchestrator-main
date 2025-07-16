import { useState, useEffect } from 'react';

const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

export const useBreakpoint = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < breakpoints.mobile,
    isTablet: window.innerWidth >= breakpoints.mobile && window.innerWidth < breakpoints.tablet,
    isDesktop: window.innerWidth >= breakpoints.tablet,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
        isDesktop: width >= breakpoints.tablet,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};
