import { Box, IconButton, List, Stack, Text, useToast } from '@chakra-ui/react';
import {
  Button,
  Card,
  Input,
  SidePanel,
  Space,
  Typography,
} from '@supabase/ui';
import React, { ReactElement, useEffect, useState } from 'react';
import { supabase } from '../authentication/Auth';
import { API_SEARCH_URL, API_URL, IMAGE_URL } from '../../constants';
import { Result, SearchResult } from '../../types/searchResult.interface';
import Genres from '../../data/genres.json';
import { MovieGenre } from '../../types/genres.interface';
import { AddIcon } from '@chakra-ui/icons';
interface Props {
  visible: boolean;
  toggle: () => void;
}

function SearchMovie({ visible, toggle }: Props): ReactElement {
  if (!visible) return <></>;
  const toast = useToast();
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[] | undefined>([]);
  const genres = Genres as MovieGenre[];

  useEffect(() => {
    getApiKey();
  }, []);

  const getApiKey = async () => {
    if (apiKey) return;
    const { data, status } = await supabase.from('user_info').select('*');
    if (status === 200 && data && data?.length > 0) {
      setApiKey(data[0].auth_key);
    }
  };

  const handleSearch = () => {
    console.log(query);
    // return;
    fetch(
      `${API_URL}${API_SEARCH_URL}?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((data: SearchResult) => {
        data?.results?.sort(
          (a, b) =>
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
        );
        setResults(data.results);
      });
  };

  const onSubmit = async (values: any) => {
    if (!confirm(`Are you sure you want to add ${values.title} movie?`)) return;
    const user = supabase.auth.user();
    if (!user) return console.log('No user');
    const model = {
      title: values.title.trim(),
      description: values.overview.trim(),
      image: IMAGE_URL + values.poster_path.trim(),
      genre: values.genre_ids
        ?.map((id) => genres.find((g) => g.id === id)?.name)
        ?.join('/')
        ?.trim('/'),
      year: new Date(values.release_date).getFullYear(),
      rating: (Number(values.vote_average) * 10) / 20,
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
    } else if (error) {
      alert(JSON.stringify(error));
      toast({
        title: 'Failed.',
        status: 'error',
        duration: 4500,
        isClosable: true,
      });
    }
  };

  return (
    <SidePanel
      visible={visible}
      title="Search Movie"
      onCancel={toggle}
      customFooter={
        [
          // <Space>
          //   <Button type="secondary">Add Selected</Button>
          // </Space>,
        ]
      }
    >
      <Input
        placeholder="type your query here"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Stack width="100%" alignItems="end" marginTop="0.5em">
        <Button onClick={handleSearch}>Search</Button>
      </Stack>
      <List spacing={5} marginTop={2}>
        {results?.map((item) => {
          return (
            <Card
              key={item.id}
              style={{
                padding: '0.5em',
                cursor: 'pointer',
              }}
            >
              <Typography.Title
                style={{
                  fontSize: '1.125em',
                  fontWeight: 400,
                  fontFamily: 'monospace',
                }}
              >
                {item.title}
                {item.release_date &&
                  ` - ${new Date(item.release_date).getFullYear()}`}
              </Typography.Title>
              <Box
                display="flex"
                flexDirection="row"
                gridGap="1em"
                fontSize="0.725em"
                mt={1}
              >
                {item.genre_ids?.map((id) => {
                  return <Text>{genres.find((g) => g.id === id)?.name}</Text>;
                })}
              </Box>
              <IconButton
                style={{ position: 'absolute', right: '0.5em', top: '0.5em' }}
                variant="ghost"
                colorScheme="teal"
                fontSize={12}
                size={'xs'}
                aria-label="Add movie"
                icon={<AddIcon />}
                onClick={() => onSubmit(item)}
              />
            </Card>
          );
        })}
      </List>
    </SidePanel>
  );
}

export default SearchMovie;
