import React, { useEffect, useState } from 'react';
import { supabase } from './client/supabaseClient';
import Login from './components/authentication/Login';
import { Session } from '@supabase/supabase-js';
import { Box } from '@chakra-ui/layout';
import Home from './views/Home';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session): any => {
      setSession(session);
    });
  }, []);
  return <>{!session ? <Login /> : <Home session={session} />}</>;
}

export default App;
