import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const initialData = JSON.parse(localStorage.getItem(storageName) ?? '{}');
  
  const [token, setToken] = useState<string | null>(initialData.token);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<number | null>(initialData.userId);

  const login = useCallback((jwtToken: string | null, id: number | null) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName) ?? '{}');
    if (data && data.token) {
      login(data.token, data.userId);
    }

    setReady(true);    
  }, [login]);


  return { login, logout, token, userId, ready };
}