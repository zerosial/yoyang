import { useState, useCallback, useEffect } from "react";
import type { PostgrestError } from "@supabase/supabase-js";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초

interface UseSupabaseQueryResult<T> {
  data: T | null;
  error: PostgrestError | Error | null;
  loading: boolean;
  retry: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  queryFn: () =>
    | Promise<{ data: T | null; error: PostgrestError | null }>
    | { data: T | null; error: PostgrestError | null },
  deps: unknown[] = []
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const [loading, setLoading] = useState(true);

  const executeQuery = useCallback(
    async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);

        const result = await Promise.resolve(queryFn());

        if (result.error) {
          // 네트워크 에러인 경우 재시도
          if (
            result.error.message?.includes("network") &&
            retryCount < MAX_RETRIES
          ) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            return executeQuery(retryCount + 1);
          }
          throw result.error;
        }

        setData(result.data);
      } catch (err) {
        setError(err as PostgrestError | Error);
      } finally {
        setLoading(false);
      }
    },
    [queryFn]
  );

  useEffect(() => {
    executeQuery();
  }, [executeQuery, ...deps]);

  const retry = useCallback(() => {
    return executeQuery();
  }, [executeQuery]);

  return { data, error, loading, retry };
}

// 사용 예시:
// const { data, error, loading, retry } = useSupabaseQuery(() =>
//   supabase.from('table').select('*')
// );
