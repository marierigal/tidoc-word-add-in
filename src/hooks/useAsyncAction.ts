import * as React from 'react';

export function useAsyncAction<T extends unknown[], S>(action: (...args: T) => Promise<S>) {
  const [result, setResult] = React.useState<S | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const run = async (...args: T) => {
    setIsLoading(true);

    try {
      setResult(await action(...args));
    } catch (e) {
      console.error(e);
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  return { run, result, error, isLoading };
}
