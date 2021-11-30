import { Input } from '@chakra-ui/input';
import { Grid, VStack, Center, Box } from '@chakra-ui/layout';
import {
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

export default function Login() {
  const { signin, loading, error, session } = useAuth();
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [toggleMessage, setToggleMessage] = useState({
    status: 'success' as 'success' | 'error',
    message: '',
    state: false,
  });

  useEffect(() => {
    if (error)
      setToggleMessage({
        status: 'error',
        state: true,
        message: error.error_description || error.message,
      });
    if (session) navigate('/');
  }, [error]);

  const handleLogin = async (email: string) => {
    signin({ email, password });
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
          <Input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
