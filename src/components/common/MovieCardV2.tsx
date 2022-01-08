import React, { ReactElement } from 'react';
import { Badge, Button } from '@supabase/ui';
import './MovieCardV2.css';
import { Tooltip } from '@chakra-ui/tooltip';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import ReactStars from 'react-rating-stars-component';
import ReleaseYear from './ReleaseYear';
import AlertCommon from './AlertCommon';
import { IoMdRemove } from 'react-icons/io';
import EditMovie from '../modals/EditMovie';
interface Props {
  id: number;
  poster: string;
  title: string;
  year: string;
  genre: string;
  rating: string;
  description: string;
  wikiLink: string;
  imdbLink: string;
}

const colors = ['blue', 'green', 'indigo', 'pink', 'purple', 'red', 'yellow'];
type badgeColors =
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

function MovieCardV2(props: Props): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box className="card">
      <Box className="card-edit">
        <button aria-label="Remove" onClick={onOpen}>
          Edit
        </button>
      </Box>
      <AlertCommon
        header="Delete?"
        body={`Are you sure you want to delete ${props.title}`}
        CustomIcon={IoMdRemove}
        id={props.id}
        actionName="REMOVE"
      />
      {isOpen && (
        <EditMovie
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          item={{
            id: props.id,
            title: props.title,
            poster: props.poster,
            rating: props.rating,
            genre: props.genre,
            year: props.year,
            wikiLink: props.wikiLink,
            imdbLink: props.imdbLink,
            description: props.description,
          }}
        />
      )}
      <Box className="poster">
        <img src={props.poster} loading="lazy" />
      </Box>
      <Box className="details">
        <Heading
          textAlign={'center'}
          fontSize={'medium'}
          fontWeight={500}
          maxW={'100%'}
          color={'white'}
          fontFamily={'body'}
          whiteSpace={'nowrap'}
          overflow={'hidden'}
          textOverflow={'ellipsis'}
        >
          <Tooltip
            hasArrow
            label={`${props.title} (${props.year})`}
            aria-label={`${props.title} (${props.year})`}
          >
            {`${props.title} (${props.year})`}
          </Tooltip>
        </Heading>
        <Box className="released-year">
          {props.year && <ReleaseYear year={props.year} />}
        </Box>
        <Box className="rating">
          {props.rating && (
            <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack spacing={0} align={'center'}>
                <ReactStars
                  count={5}
                  value={Number(props.rating)}
                  onChange={(e: any) => console.log(e)}
                  size={24}
                  isHalf={true}
                  edit={false}
                  activeColor="#ffd700"
                />
              </Stack>
            </Stack>
          )}
        </Box>
        <Box className="tags">
          {props.genre ? (
            props.genre.split('/').map((i, idx) => (
              <Badge
                key={idx}
                color={
                  colors[
                    Math.round(Math.random() * colors.length)
                  ] as badgeColors
                }
              >
                {i}
              </Badge>
            ))
          ) : (
            <br />
          )}
        </Box>
        <Box className="info">
          <p>{props.description}</p>
        </Box>
        <Flex
          gridGap={'5px'}
          fontSize="0.8em"
          justifyContent="center"
          alignItems="center"
        >
          {props.wikiLink && (
            <Box textAlign="center" color="skyblue">
              <Link href={props.wikiLink} isExternal>
                Wikipedia
              </Link>
            </Box>
          )}
          {props.imdbLink && (
            <Box textAlign="center" color="orange">
              <Link href={props.imdbLink} isExternal>
                Imdb
              </Link>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default MovieCardV2;
