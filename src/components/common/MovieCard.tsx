import {
  Center,
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Link,
  Badge,
} from '@chakra-ui/layout';
import { Avatar, Button, IconButton, Image, useToast } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import ReactStars from 'react-rating-stars-component';
import React from 'react';
import { IoMdRemove } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { TEXT_MT } from '../../constants';
import ReleaseYear from './ReleaseYear';
import AlertCommon from './AlertCommon';
import EditMovie from '../modals/EditMovie';

export default function MovieCard({
  id,
  title,
  poster,
  rating,
  genre,
  year,
  wikiLink,
  imdbLink,
  description,
}: any) {
  return (
    <Center py={6} position="relative">
      <AlertCommon
        header="Delete?"
        body={`Are you sure you want to delete ${title}`}
        CustomIcon={IoMdRemove}
        id={id}
        actionName="REMOVE"
      />
      <EditMovie
        item={{
          id,
          title,
          poster,
          rating,
          genre,
          year,
          wikiLink,
          imdbLink,
          description,
        }}
      />
      <Box
        minW="150px"
        maxW={'270px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Box position="relative" className="movie-image">
          <Image
            h={'210px'}
            w={'full'}
            src={poster}
            fallbackSrc="https://via.placeholder.com/150x160"
            objectFit={'cover'}
          />
          <Box className="movie-description" w={'full'} p="1.5">
            {description}
          </Box>
        </Box>
        <Box p={6}>
          <Stack spacing={0} align={'center'}>
            <Heading
              textAlign={'center'}
              fontSize={'2xl'}
              fontWeight={500}
              fontFamily={'body'}
            >
              {title}
            </Heading>
            {genre && (
              <Text pt={TEXT_MT} color={'gray.500'}>
                {genre}
              </Text>
            )}
            {year && <ReleaseYear year={year} />}
          </Stack>

          {rating && (
            <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack spacing={0} align={'center'}>
                <ReactStars
                  count={5}
                  value={Number(rating)}
                  onChange={(e: any) => console.log(e)}
                  size={24}
                  isHalf={true}
                  edit={false}
                  activeColor="#ffd700"
                />
              </Stack>
            </Stack>
          )}
          {wikiLink && (
            <Box textAlign="center">
              <Link href={wikiLink} isExternal>
                Wikipedia
              </Link>
            </Box>
          )}
          {imdbLink && (
            <Box textAlign="center">
              <Link href={imdbLink} isExternal>
                Imdb
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Center>
  );
}
