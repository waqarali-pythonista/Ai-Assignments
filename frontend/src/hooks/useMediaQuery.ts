import { useState, useEffect } from 'react';

interface UseMediaQueryOptions {
  query: string;
  defaultMatches?: boolean;
}

export const useMediaQuery = ({
  query,
  defaultMatches = false,
}: UseMediaQueryOptions) => {
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}; 