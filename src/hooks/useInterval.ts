import * as React from 'react';

/**
 * Runs `callback` immediately, then every `delayMs` milliseconds, until the
 * component unmounts or `delayMs` becomes null (pause).
 */
export function useInterval(callback: () => void, delayMs: number | null): void {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(() => {
    if (delayMs === null) return null;

    callbackRef.current(); // run once immediately, don't wait for the first tick

    const intervalId = setInterval(() => callbackRef.current(), delayMs);
    return () => clearInterval(intervalId);
  }, [delayMs]);
}
