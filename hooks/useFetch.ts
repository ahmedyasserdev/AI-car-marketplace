import { useState } from "react";
import { toast } from "sonner";

// Define the callback function type
type FetchCallback<T, Args extends any[]> = (...args: Args) => Promise<T>;

// Define the return type of the hook
type UseFetchResult<T, Args extends any[]> = {
  data: T | undefined;
  loading: boolean | null;
  error: Error | null;
  fn: (...args: Args) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
};

export function useFetch<T, Args extends any[]>(
  cb: FetchCallback<T, Args>
): UseFetchResult<T, Args> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: Args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}
