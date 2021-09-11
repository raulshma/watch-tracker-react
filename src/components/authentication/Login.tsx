import { Input } from '@chakra-ui/input';
import { Grid, VStack, Center, Box } from '@chakra-ui/layout';
import {
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { supabase } from '../../client/supabaseClient';

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [toggleMessage, setToggleMessage] = useState({
    status: 'success' as 'success' | 'error',
    message: '',
    state: false,
  });

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      setToggleMessage({
        status: 'success',
        state: true,
        message: 'Check your email for the login link!',
      });
    } catch (error: any) {
      setToggleMessage({
        status: 'error',
        state: true,
        message: error.error_description || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid placeItems="center" h="100vh">
      <VStack>
        <Center>Sign in via magic link with your email below</Center>
        <Box>
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
            isLoading={loading}
            loadingText="Sending Link"
          >
            Login
          </Button>
        </Box>
        {toggleMessage.state && (
          <Alert status={toggleMessage.status}>
            <AlertIcon />
            <AlertTitle mr={2}>{toggleMessage.message}</AlertTitle>
            <CloseButton
              onClick={(e) =>
                setToggleMessage((prev: any) => ({ ...prev, state: false }))
              }
              position="absolute"
              right="8px"
              top="8px"
            />
          </Alert>
        )}
      </VStack>
    </Grid>
  );
}
