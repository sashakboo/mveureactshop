import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const request = useCallback( async (url: string, method: string = 'GET', body: string | FormData | null  = null, headers: { [id: string] : string; } = {}) => {
    setLoading(true);
    try {
      if (body != null && typeof body === 'string') {
        headers['Content-type'] = 'application/json';
      }
      const response = await fetch(url, {
        method, body, headers
      });  

      if (response.status === 401) {
        auth.logout();
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так');
      }

      setLoading(false);
      
      return data;
    } catch (e) {
      setLoading(false);
      setError((e as Error).message);
      throw e;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, request, error, clearError };

}