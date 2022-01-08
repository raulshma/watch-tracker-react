import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
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
import { MdEdit } from 'react-icons/md';
import { supabase } from '../../components/authentication/Auth';
import { REGEX_URL } from '../../constants';

export default function EditMovie({ item: item, isOpen, onOpen, onClose }: any) {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values: any) => {
    const user = supabase.auth.user();
    if (!user) return console.log('No user');
    setLoading((prev: boolean) => !prev);
    const rating = Number(values.rating);
    const model = {
      title: values.title,
      description: values.description,
      image: values.image_url,
      genre: values.genre,
      year: values.year,
      wiki_link: values.wiki_link,
      imdb_link: values.imdb_link,
      rating: rating === 0 ? null : rating,
      user_id: user.id,
    };
    const { data, error } = await supabase
      .from('list')
      .update([model])
      .eq('id', item.id);
    if (data) {
      toast({
        title: 'Success.',
        status: 'success',
        duration: 4500,
        isClosable: true,
      });
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
    <>
      <IconButton
        position="absolute"
        zIndex="1"
        bottom="0"
        left="0"
        size="xs"
        marginLeft={2}
        marginBottom={8}
        aria-label="Remove"
        fontSize="1rem"
        borderRadius="2rem"
        icon={<MdEdit />}
        onClick={onOpen}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        {isOpen && (
          <>
            <ModalOverlay />
            <ModalContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Update movie</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl isInvalid={errors.title}>
                    <FormLabel>Title</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Title"
                      defaultValue={item.title}
                      {...register('title', { required: true })}
                    />
                  </FormControl>

                  <FormControl mt={2} isInvalid={errors.description}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      size="sm"
                      rows={2}
                      defaultValue={item.description}
                      placeholder="Description"
                      {...register('description', { required: true })}
                    />
                  </FormControl>
                  <FormControl mt={2} isInvalid={errors.image_url}>
                    <FormLabel>Image Url</FormLabel>
                    <Input
                      size="sm"
                      defaultValue={item.poster ?? ''}
                      placeholder="Image Url"
                      {...register('image_url', { pattern: REGEX_URL })}
                    />
                  </FormControl>
                  <HStack>
                    <FormControl pt={2} isInvalid={errors.genre}>
                      <FormLabel>Genre</FormLabel>
                      <Input
                        size="sm"
                        defaultValue={item.genre ?? ''}
                        placeholder="Genre"
                        {...register('genre')}
                      />
                    </FormControl>
                    <FormControl pt={2} isInvalid={errors.year}>
                      <FormLabel>Release Year</FormLabel>
                      <Input
                        size="sm"
                        defaultValue={item.year ?? ''}
                        placeholder="Year"
                        {...register('year')}
                      />
                    </FormControl>
                  </HStack>
                  <FormControl pt={2} isInvalid={errors.rating}>
                    <FormLabel>Rating</FormLabel>
                    <Input
                      size="sm"
                      defaultValue={item.rating ?? ''}
                      placeholder="Rating"
                      {...register('rating')}
                    />
                  </FormControl>
                  <FormControl mt={2} isInvalid={errors.wiki_link}>
                    <FormLabel>Wikipedia Link</FormLabel>
                    <Input
                      size="sm"
                      defaultValue={item.wikiLink ?? ''}
                      placeholder="Wikipedia Link"
                      {...register('wiki_link', { pattern: REGEX_URL })}
                    />
                  </FormControl>
                  <FormControl mt={2} isInvalid={errors.imdb_link}>
                    <FormLabel>IMDB Link</FormLabel>
                    <Input
                      size="sm"
                      defaultValue={item.imdbLink ?? ''}
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
                    Update
                  </Button>
                  <Button size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </>
        )}
      </Modal>
    </>
  );
}
