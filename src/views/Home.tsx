import { Box, Center, Flex, HStack, Spacer, VStack } from '@chakra-ui/layout';
import { Grid, Spinner, useToast } from '@chakra-ui/react';
import { Session } from '@supabase/gotrue-js';
import { PostgrestError } from '@supabase/postgrest-js';
import React, { useEffect, useState } from 'react';
import { useTransition, animated } from '@react-spring/web';

import { supabase } from '../client/supabaseClient';
import MovieCard from '../components/common/MovieCard';
import AddItem from '../components/modals/AddMovie';
import { GRID_GAP, GRID_ML, GRID_MR } from '../constants';
import { useGlobalState } from '../store/items';

type Response = {
  data: any[] | null;
  error: PostgrestError | null;
};

export default function Home({ session }: { session: Session }) {
  const itemsArray = useGlobalState();
  const transition = useTransition(itemsArray.get(), {
    from: { x: -100, y: -200, opacity: 0 },
    enter: (item) => async (next) => {
      await next({ y: 0, opacity: 1, delay: item.delay });
    },
    leave: { x: -100, y: -200, opacity: 0 },
  });

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    let init = await supabase
      .from('list')
      .select('*')
      .order('updated_at', { ascending: false });
    itemsArray.itemsAdd(init.data);
    await supabase
      .from('list')
      .on('*', (payload) => {
        console.log('Change received!', payload);
        if (payload.eventType === 'DELETE') {
          itemsArray.itemsRemove(payload.old.id);
        } else itemsArray.itemsAdd(payload.new);
      })
      .subscribe();
  }
  return (
    <Box>
      <Box>
        <AddItem />
      </Box>
      <Flex
        gap={GRID_GAP}
        align="center"
        justify="space-evenly"
        wrap="wrap"
        ml={GRID_ML}
        mr={GRID_MR}
      >
        {itemsArray.get().map((i, _) => (
          <MovieCard
            id={i.id}
            title={i.title}
            poster={i.image}
            description={i.description}
            rating={i.rating}
            genre={i.genre}
            year={i.year}
            wikiLink={i.wiki_link}
            imdbLink={i.imdb_link}
            key={i.id}
          />
        ))}
      </Flex>
    </Box>
  );
}
