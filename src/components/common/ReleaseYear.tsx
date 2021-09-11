import React from 'react';
import { Text, Badge } from '@chakra-ui/react';
import { TEXT_MT } from '../../constants';

export default function ReleaseYear({ year }: any) {
  return (
    <Text pt={TEXT_MT} color={'gray.500'}>
      {year === new Date().getFullYear().toString() ? (
        <Badge colorScheme="green">{year}</Badge>
      ) : (
        <Badge>{year}</Badge>
      )}
    </Text>
  );
}
