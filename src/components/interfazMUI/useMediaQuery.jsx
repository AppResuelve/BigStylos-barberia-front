const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 2000,
};

export const useMediaQueryHook = () => {
  return {
    xs: window.matchMedia(`(max-width: ${breakpoints.xs}px)`).matches,
    sm: window.matchMedia(`(max-width: ${breakpoints.sm}px)`).matches,
    md: window.matchMedia(`(max-width: ${breakpoints.md}px)`).matches,
    lg: window.matchMedia(`(max-width: ${breakpoints.lg}px)`).matches,
    xl: window.matchMedia(`(max-width: ${breakpoints.xl}px)`).matches,
  };
};