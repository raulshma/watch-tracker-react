import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { session } = useAuth();

  return session ? children : <Navigate to="/auth" replace={true} />;
}

export default RequireAuth;
