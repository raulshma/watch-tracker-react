import { Flex } from '@chakra-ui/react';
import { Alert, Button, Input } from '@supabase/ui';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { supabase } from '../components/authentication/Auth';
import { useAuth } from '../providers/AuthProvider';
interface Props {}

export default function Settings({}: Props): ReactElement {
  const [apiKey, setApiKey] = useState<string>('');
  const [buttonText, setButtonText] = useState<string>('Save');
  const [alertState, setAlertState] = useState({
    active: false,
    text: '',
    error: false,
  });
  const auth = useAuth();

  const removeAlert = () => {
    setTimeout(() => {
      setAlertState({
        active: false,
        text: '',
        error: false,
      });
    }, 4000);
  };

  const getApiKey = async () => {
    const { data, status } = await supabase.from('user_info').select('*');
    if (status === 200 && data && data?.length > 0) {
      setApiKey(data[0].auth_key);
      setButtonText('Update');
    }
  };

  const saveApiKey = async () => {
    if (apiKey.trim().length > 0) {
      const userId = auth.session?.user?.id;
      const { data: existingKey, status: existingkeyStatus } = await supabase
        .from('user_info')
        .select('*')
        .eq('user_id', userId);
      if (existingkeyStatus === 200 && existingKey && existingKey.length > 0) {
        const existing = existingKey[0];
        existing.auth_key = apiKey;
        const { data, status } = await supabase
          .from('user_info')
          .update([existing]);
        if (status === 200 && data) {
          setAlertState((prev) => {
            return { ...prev, active: true, error: false, text: 'Updated' };
          });
        } else {
          setAlertState((prev) => {
            return {
              ...prev,
              active: true,
              error: true,
              text: 'Update Failed',
            };
          });
        }
      } else {
        const { data, status } = await supabase
          .from('user_info')
          .insert([{ auth_key: apiKey, user_id: userId }]);
        if (status === 200) {
          setAlertState((prev) => {
            return { ...prev, active: true, error: false, text: 'Saved' };
          });
        } else {
          setAlertState((prev) => {
            return {
              ...prev,
              active: true,
              error: true,
              text: 'Save Failed',
            };
          });
        }
      }
      removeAlert();
    }
  };

  useEffect(() => {
    getApiKey();
  }, []);
  return (
    <Flex
      p="1rem"
      gridGap="1rem"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Input
        label="Tmdb Api Key"
        value={apiKey}
        onChange={(val) => setApiKey(val.target.value)}
      />
      <Button type="primary" onClick={saveApiKey}>
        {buttonText}
      </Button>
      {alertState && alertState.active && (
        <Alert
          title={alertState.text}
          variant={alertState.error ? 'danger' : 'success'}
        />
      )}
    </Flex>
  );
}
