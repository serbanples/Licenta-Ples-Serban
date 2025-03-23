import { useState, useCallback } from 'react';

// Define a generic type for the request function with parameter and return types
type RequestFn<T, P extends any[]> = (...args: P) => Promise<T>;

export function useRequest() {
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async <T, P extends any[]>(
      requestFn: RequestFn<T, P>, // The request function with typed parameters
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
      },
      ...args: P // Spread the parameters to match the request function
    ): Promise<{ data: T | null; error: Error | null }> => {
      setLoading(true);

      try {
        const data = await requestFn(...args); // Pass the parameters to the request function
        setLoading(false);

        if (options?.onSuccess) {
          options.onSuccess(data);
        }

        return { data, error: null };
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setLoading(false);

        if (options?.onError) {
          options.onError(errorObj);
        }

        return { data: null, error: errorObj };
      }
    },
    []
  );

  return { request, loading };
}