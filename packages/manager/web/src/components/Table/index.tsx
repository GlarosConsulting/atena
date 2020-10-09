import React, { useMemo } from 'react';
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronUp,
} from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';

import { BoxProps, Flex, Text } from '@chakra-ui/core';

import Card from './Card';
import BottomSection from './Card/CardFooter';
import TopSection from './Card/CardHeader/index';
import {
  StyledTable,
  TableCell,
  TableHead,
  TableIconButton,
  TableRow,
} from './styles';

interface ITableProps<T extends object> extends BoxProps {
  heading?: React.ReactNode;
  columns: Column<T>[];
  data: any;
  pageSize?: number;
  onRowClick?: (row: Row<T>) => void;
}

const Table = <T extends object>({
  heading,
  columns,
  data,
  pageSize: initialPageSize = 10,
  onRowClick,
  ...rest
}: ITableProps<T>) => {
  const tableColumns = useMemo(() => columns, [columns]);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' });

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<T>(
    {
      columns: tableColumns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: initialPageSize,
      } as any,
    },
    useSortBy,
    usePagination,
  ) as any;

  return (
    <Card
      flexDirection="column"
      flex={1}
      maxWidth="100%"
      width="100%"
      {...rest}
    >
      {heading && <TopSection>{heading}</TopSection>}

      <StyledTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <Flex
              key={headerGroup.id}
              flex={1}
              flexDirection="row"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map(column => (
                <TableCell
                  p={4}
                  key={column.id}
                  bg="gray.50"
                  justifyContent="space-between"
                  {...column.getHeaderProps()}
                  {...column.getSortByToggleProps()}
                >
                  <Text fontWeight="bold">{column.render('Header')}</Text>

                  {(() => {
                    if (column.isSorted) {
                      if (column.isSortedDesc) {
                        return <FiChevronDown size={20} />;
                      }

                      return <FiChevronUp size={20} />;
                    }

                    return '';
                  })()}
                </TableCell>
              ))}
            </Flex>
          ))}
        </TableHead>

        <Flex flexDirection="column">
          {page.map((row, key) => {
            prepareRow(row);

            return (
              <TableRow
                onClick={() => onRowClick && onRowClick(row)}
                  key={key} // eslint-disable-line
                flexDirection="row"
                {...row.getRowProps()}
              >
                {row.cells.map(cell => (
                  <TableCell
                    key={cell.row.index}
                    justifyContent="flex-start"
                    p={4}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </Flex>
      </StyledTable>

      <BottomSection justifyContent="space-between" flexDirection="row">
        <Flex flexDirection="row">
          <TableIconButton
            mr={2}
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
            icon={() => <FiChevronsLeft size={20} />}
          />

          <TableIconButton
            mr={2}
            isDisabled={!canPreviousPage}
            onClick={() => previousPage()}
            icon={() => <FiChevronLeft size={20} />}
          />
        </Flex>

        <Flex justifyContent="center" alignItems="center">
          <Text mr={4}>
            Página{' '}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>
          </Text>

          {!isTabletOrMobile && (
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>
                  {size} linhas
                </option>
              ))}
            </select>
          )}
        </Flex>

        <Flex flexDirection="row">
          <TableIconButton
            ml={2}
            isDisabled={!canNextPage}
            onClick={() => nextPage()}
            icon={() => <FiChevronRight size={20} />}
          />

          <TableIconButton
            ml={2}
            onClick={() => gotoPage(pageCount ? pageCount - 1 : 1)}
            isDisabled={!canNextPage}
            icon={() => <FiChevronsRight size={20} />}
          />
        </Flex>
      </BottomSection>
    </Card>
  );
};

export default Table;
