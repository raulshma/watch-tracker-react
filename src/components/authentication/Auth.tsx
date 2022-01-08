import React from 'react';
import { Auth, Typography, Button } from '@supabase/ui';
import { createClient } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Container = (props) => {
  const { user } = Auth.useUser();
  if (user) return <Navigate to="/" />;
  return props.children;
};

export default function AuthBasic() {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container supabaseClient={supabase}>
        <Auth
          magicLink={true}
          supabaseClient={supabase}
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </Container>
    </Auth.UserContextProvider>
  );
}
