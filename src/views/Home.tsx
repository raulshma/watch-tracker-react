import { Box, HStack, VStack } from '@chakra-ui/layout';
import { Grid } from '@chakra-ui/react';
import { Session } from '@supabase/gotrue-js';
import { PostgrestError } from '@supabase/postgrest-js';
import React, { useEffect, useState } from 'react';
import { supabase } from '../client/supabaseClient';
import MovieCard from '../components/common/MovieCard';
import AddItem from '../components/modals/AddMovie';
import { GRID_GAP, GRID_ML, GRID_MR } from '../constants';

type Response = {
  data: any[] | null;
  error: PostgrestError | null;
};

export default function Home({ session }: { session: Session }) {
  const [response, setResponse] = useState<Response>({
    data: null,
    error: null,
  });

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    let { data: response, error } = await supabase.from('list').select('*');
    console.log(response);
    setResponse({ data: response, error });
  }

  if (response.error || !response.data) return <Box>Failed to fetch data</Box>;
  return (
    <Box>
      <Box>
        <AddItem />
      </Box>
      <Grid
        templateColumns="repeat(5, 1fr)"
        gap={GRID_GAP}
        ml={GRID_ML}
        mr={GRID_MR}
      >
        {response.data.map((i, _) => (
          <MovieCard
            title={i.title}
            poster={i.image}
            rating={i.rating}
            genre={i.genre}
            year={i.year}
            wikiLink={i.wiki_link}
            imdbLink={i.imdb_link}
            key={i.id}
          />
        ))}
      </Grid>
    </Box>
  );
}
