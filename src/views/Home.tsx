import { Button, IconButton } from '@chakra-ui/button';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Flex } from '@chakra-ui/layout';

import { Session } from '@supabase/gotrue-js';
import { PostgrestError } from '@supabase/postgrest-js';
import React, { useEffect } from 'react';
import { MdClear } from 'react-icons/md';

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
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [filteredData, setFilteredData] = React.useState<any>([]);

  useEffect(() => {
    getList();
  }, []);

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    setSearchValue(value);
    let result: any[] = [];
    if (event.target.value == '') {
      setFilteredData(itemsArray.get());
      setSearchValue('');
      return;
    }
    result = itemsArray.get().filter((data) => {
      return (
        data.title?.toLowerCase().includes(value) ||
        data.year?.includes(value) ||
        data.genre?.toLowerCase().includes(value)
      );
    });
    setFilteredData(result);
  };

  async function getList() {
    let init = await supabase
      .from('list')
      .select('*')
      .order('updated_at', { ascending: false });
    itemsArray.itemsAdd(init.data);
    setFilteredData(init.data);
    await supabase
      .from('list')
      .on('*', (payload) => {
        console.log('Change received!', payload);
        if (payload.eventType === 'DELETE') {
          itemsArray.itemsRemove(payload.old.id);
          setFilteredData((prev) => {
            return prev.filter((i) => i.id !== payload.old.id);
          });
        } else {
          itemsArray.itemsAdd(payload.new);
          setFilteredData((prev) => {
            return [payload.new, ...prev];
          });
        }
      })
      .subscribe();
  }
  return (
    <Box>
      <Box display="flex" flexDirection="row">
        <Box display="grid" placeItems="center">
          <AddItem />
        </Box>
        <InputGroup size="md" m="2">
          <Input
            type="text"
            variant="flushed"
            onChange={handleSearch}
            value={searchValue}
            placeholder="Search by title, genre & year."
          />
          <InputRightElement>
            <IconButton
              aria-label="Clear"
              variant="ghost"
              isRound
              onClick={() => handleSearch({ target: { value: '' } })}
              icon={<MdClear />}
            />
          </InputRightElement>
        </InputGroup>
        <Box display="grid" placeItems="center">
          <Button
            onClick={() => supabase.auth.signOut()}
            variant="solid"
            mx="1rem"
            size="sm"
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Flex
        gap={GRID_GAP}
        align="center"
        justify="space-evenly"
        wrap="wrap"
        ml={GRID_ML}
        mr={GRID_MR}
      >
        {filteredData.map((i, _) => (
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
