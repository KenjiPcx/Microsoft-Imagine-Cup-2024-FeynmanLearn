import { useRef, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

export const useDebounce = (callback: unknown, delay: number) => {
  const ref = useRef<any>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: any[]) => {
      ref.current?.(...args);
    };

    return debounce(func, delay);
  }, []);

  return debouncedCallback;
};

