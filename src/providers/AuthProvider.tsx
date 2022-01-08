import React, { useEffect } from 'react';
import { supabase } from '../components/authentication/Auth';
import { Session, UserCredentials } from '@supabase/supabase-js';

interface AuthContextType {
  loading: boolean;
  session: Session | null;
  error: any;
  signin: (user: UserCredentials, callback?: any, errorCallback?: any) => void;
  signout: (callback?: VoidFunction) => void;
}
let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const [error, setError] = React.useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession((prev) => session);
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession((prev) => session);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signin = (
    user: UserCredentials,
    callback?: VoidFunction,
    errorCallback?: any
  ) => {
    setLoading(true);
    return supabase.auth
      .signIn(user)
      .then((res) => {
        console.log(res);
        if (res.session) {
          setSession(res.session);
          if (callback) callback();
        } else if (res.error) setError(res.error);
      })
      .catch((error) => {
        if (errorCallback) errorCallback();
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signout = (callback?: VoidFunction) => {
    return supabase.auth
      .signOut()
      .then(() => {
        setSession(null);
        setError(null);
        if (callback) callback();
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <AuthContext.Provider value={{ signin, signout, session, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return React.useContext(AuthContext);
}

export { AuthProvider, useAuth, AuthContext };
