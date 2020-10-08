import { useState, useEffect } from 'react';

import Cookies from '@/lib/cookies';

const usePersistedState = <T = any>(
  key: string,
  initialState: T,
): [T, React.Dispatch<T>] => {
  const [state, setState] = useState(() => {
    const persistedValue = Cookies.get<T>(key);

    if (persistedValue) {
      return persistedValue;
    }

    return initialState;
  });

  useEffect(() => {
    Cookies.set(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default usePersistedState;
