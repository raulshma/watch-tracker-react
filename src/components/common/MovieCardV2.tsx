import React, { ReactElement } from 'react';
import { Badge } from '@supabase/ui';
import './MovieCardV2.css';
import { Tooltip } from '@chakra-ui/tooltip';
import { Box, Flex, Heading, Link, Stack } from '@chakra-ui/react';
import ReactStars from 'react-rating-stars-component';
import ReleaseYear from './ReleaseYear';
interface Props {
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
  return (
    <div className="card">
      <div className="poster">
        <img src={props.poster} />
      </div>
      <div className="details">
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
        <div className="released-year">
          {props.year && <ReleaseYear year={props.year} />}
        </div>
        <div className="rating">
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
        </div>
        <div className="tags">
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
        </div>
        <div className="info">
          <p>{props.description}</p>
        </div>
        <Flex gridGap={'5px'} fontSize="0.8em" justifyContent="center" alignItems="center">
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
      </div>
    </div>
  );
}

export default MovieCardV2;
