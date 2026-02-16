import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuthService = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (u) => {

      setUser(u);
      setLoading(false);
    }, (error) => {
      console.error('[Auth] Auth state observer error:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
