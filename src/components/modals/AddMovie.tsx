import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../components/authentication/Auth';
import { REGEX_URL } from '../../constants';
import {
  Button as SupabaseButton,
} from '@supabase/ui';
export default function AddMovie() {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values: any) => {
    const user = supabase.auth.user();
    if (!user) return console.log('No user');
    setLoading((prev: boolean) => !prev);
    const rating = Number(values.rating);
    const model = {
      title: values.title.trim(),
      description: values.description.trim(),
      image: values.image_url.trim(),
      genre: values.genre.trim(),
      year: values.year.trim(),
      wiki_link: values.wiki_link.trim(),
      imdb_link: values.imdb_link.trim(),
      rating: rating === 0 ? null : rating,
      user_id: user.id,
    };
    const { data, error } = await supabase.from('list').insert([model]);
    if (data) {
      toast({
        title: 'Success.',
        status: 'success',
        duration: 4500,
        isClosable: true,
      });
      reset();
      onClose();
    } else if (error) {
      toast({
        title: 'Failed.',
        status: 'error',
        duration: 4500,
        isClosable: true,
      });
    }
    setLoading((prev: boolean) => !prev);
  };

  return (
    <Box m="2">
      <SupabaseButton onClick={onOpen}>
        ADD
      </SupabaseButton>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add movie</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {/* <MovieAutoSuggest /> */}
              <FormControl isInvalid={errors.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  size="sm"
                  placeholder="Title"
                  {...register('title', { required: true })}
                />
              </FormControl>

              <FormControl mt={2} isInvalid={errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  size="sm"
                  rows={2}
                  placeholder="Description"
                  {...register('description', { required: true })}
                />
              </FormControl>
              <FormControl mt={2} isInvalid={errors.image_url}>
                <FormLabel>Image Url</FormLabel>
                <Input
                  size="sm"
                  placeholder="Image Url"
                  {...register('image_url', { pattern: REGEX_URL })}
                />
              </FormControl>
              <HStack>
                <FormControl pt={2} isInvalid={errors.genre}>
                  <FormLabel>Genre</FormLabel>
                  <Input size="sm" placeholder="Genre" {...register('genre')} />
                </FormControl>
                <FormControl pt={2} isInvalid={errors.year}>
                  <FormLabel>Release Year</FormLabel>
                  <Input size="sm" placeholder="Year" {...register('year')} />
                </FormControl>
              </HStack>
              <FormControl pt={2} isInvalid={errors.rating}>
                <FormLabel>Rating</FormLabel>
                <Input size="sm" placeholder="Rating" {...register('rating')} />
              </FormControl>
              <FormControl mt={2} isInvalid={errors.wiki_link}>
                <FormLabel>Wikipedia Link</FormLabel>
                <Input
                  size="sm"
                  placeholder="Wikipedia Link"
                  {...register('wiki_link', { pattern: REGEX_URL })}
                />
              </FormControl>
              <FormControl mt={2} isInvalid={errors.imdb_link}>
                <FormLabel>IMDB Link</FormLabel>
                <Input
                  size="sm"
                  placeholder="IMDB Link"
                  {...register('imdb_link', { pattern: REGEX_URL })}
                />
              </FormControl>
              <FormErrorMessage>
                {errors.wiki_link && errors.wiki_link.message}
                {errors.imdb_link && errors.imdb_link.message}
              </FormErrorMessage>
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                type="submit"
                isLoading={loading}
                colorScheme="blue"
                mr={3}
              >
                Save
              </Button>
              <Button size="sm" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
