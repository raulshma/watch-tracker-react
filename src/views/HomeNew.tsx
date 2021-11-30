import React, { ReactElement, useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Tooltip,
  IconButton,
  Flex,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  ArrowRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@chakra-ui/icons';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useGlobalState } from '../store/items';
import { supabase } from '../client/supabaseClient';
interface Props {}

function HomeNew({}: Props): ReactElement {
  const [itemsArray, setItemsArray] = useState<any>([]);

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    let init = await supabase
      .from('list')
      .select('*')
      .order('updated_at', { ascending: false });
    setItemsArray(init.data);
    // await supabase
    //   .from('list')
    //   .on('*', (payload) => {
    //     console.log('Change received!', payload);
    //     if (payload.eventType === 'DELETE') {
    //       itemsArray.itemsRemove(payload.old.id);
    //     } else {
    //       itemsArray.itemsAdd(payload.new);
    //     }
    //   })
    //   .subscribe();
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Image',
        accessor: 'image',
        Cell: (props) => {
          return <img src={props.value} width={60} alt="Image" />;
        },
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Rating',
        accessor: 'rating',
        isNumeric: true,
      },
      {
        Header: 'Year',
        accessor: 'year',
        isNumeric: true,
      },
      {
        Header: 'Genre',
        accessor: 'genre',
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data: itemsArray, initialState: { pageSize: 5 } },
    useSortBy,
    usePagination
  );

  return (
    <>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={column.isNumeric}
                >
                  {column.render('Header')}
                  <chakra.span pl="4">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                  >
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon aria-label="Icon" h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{' '}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
          <Text flexShrink="0">Go to page:</Text>{' '}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value) => {
              const page = value ? value - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
}

export default HomeNew;
