import { Button, IconButton } from '@chakra-ui/button';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Flex } from '@chakra-ui/layout';
import { useDisclosure } from '@chakra-ui/react';

import { PostgrestError } from '@supabase/postgrest-js';
import {
  SidePanel,
  Space,
  Typography,
  Button as SupabaseButton,
} from '@supabase/ui';
import React, { useEffect, useState } from 'react';
import { MdClear, MdSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../components/authentication/Auth';
import MovieCard from '../components/common/MovieCard';
import MovieCardV2 from '../components/common/MovieCardV2';
import SearchMovie from '../components/common/SearchMovie';
import AddItem from '../components/modals/AddMovie';
import { GRID_GAP, GRID_ML, GRID_MR } from '../constants';
import { useAuth } from '../providers/AuthProvider';
import { useGlobalState } from '../store/items';
// import HomeNew from './HomeNew';

type Response = {
  data: any[] | null;
  error: PostgrestError | null;
};

export default function Home() {
  const navigate = useNavigate();
  let auth = useAuth();
  const itemsArray = useGlobalState();
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any>([]);
  const [visible, setVisible] = useState(false);

  function toggle() {
    setVisible(!visible);
  }
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
        <Box display="grid" placeItems="center">
          <SupabaseButton type="default" style={{width: 120}} onClick={toggle}>
            Add By Search
          </SupabaseButton>
          <SearchMovie visible={visible} toggle={toggle}/>
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
          <IconButton
            aria-label="Settings"
            variant="ghost"
            isRound
            onClick={() => navigate('/settings')}
            icon={<MdSettings />}
          />
        </Box>
        <Box display="grid" placeItems="center">
          <Button
            onClick={() => {
              auth.signout();
            }}
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
          <MovieCardV2
            key={i.id}
            id={i.id}
            poster={i.image}
            title={i.title}
            year={i.year}
            genre={i.genre}
            rating={i.rating}
            description={i.description}
            wikiLink={i.wiki_link}
            imdbLink={i.imdb_link}
          />
          // <MovieCard
          //   id={i.id}
          //   title={i.title}
          //   poster={i.image}
          //   description={i.description}
          //   rating={i.rating}
          //   genre={i.genre}
          //   year={i.year}
          //   wikiLink={i.wiki_link}
          //   imdbLink={i.imdb_link}
          //   key={i.id}
          // />
        ))}
        {/* <HomeNew /> */}
      </Flex>
    </Box>
  );
}
