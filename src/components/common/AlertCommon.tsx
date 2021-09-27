import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  AlertDialogCloseButton,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { supabase } from '../../client/supabaseClient';

export default function AlertCommon({
  header,
  body,
  id,
  CustomIcon,
  actionName,
}) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  async function performAction() {
    if (actionName === 'REMOVE') {
      const { data, error } = await supabase.from('list').delete().eq('id', id);
      if (data) {
        toast({
          title: 'Success.',
          status: 'success',
          duration: 4500,
          isClosable: true,
        });
      } else if (error) {
        toast({
          title: 'Failed.',
          status: 'error',
          duration: 4500,
          isClosable: true,
        });
      }
    }
  }

  return (
    <>
      <IconButton
        position="absolute"
        zIndex="1"
        bottom="0"
        right="0"
        size="xs"
        marginRight={2}
        marginBottom={8}
        aria-label="Remove"
        fontSize="1.25rem"
        borderRadius="2rem"
        onClick={onOpen}
        icon={<CustomIcon />}
      />
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{header}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={performAction}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
