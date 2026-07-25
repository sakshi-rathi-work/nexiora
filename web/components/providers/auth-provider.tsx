'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasRunRef = React.useRef(false);

  React.useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const restoreSession = async () => {
      try {
        const { data } = await apiClient.get('/users/me');
        const currentToken = useAuthStore.getState().accessToken ?? '';
        useAuthStore.getState().setAuth(data, currentToken);
      } catch {
        useAuthStore.getState().clearAuth();
      } finally {
        useAuthStore.getState().setInitialized(true);
      }
    };

    restoreSession();
  }, []);

  return <>{children}</>;
}
