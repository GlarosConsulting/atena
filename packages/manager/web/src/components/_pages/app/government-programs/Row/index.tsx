import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

import { Collapse, Flex, useTheme } from '@chakra-ui/core';
import { format } from 'date-fns';

import { IGovernmentProgram } from '@/interfaces/government-programs/IGovernmentProgram';

import { Container, Value, AmendmentRow } from './styles';

interface IRow {
  data: IGovernmentProgram;
  isOpen?: boolean;
  onClick?(event: React.MouseEvent<any, MouseEvent>): void;
}

const Row: React.FC<IRow> = ({ data, isOpen = false, onClick }) => {
  const theme = useTheme();

  return (
    <Container
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      paddingY={2}
      paddingX={4}
      isOpen={isOpen}
      onClick={onClick}
    >
      <Flex fontSize="lg" flexDirection={{ xs: 'column', md: 'row' }}>
        <Value width="30%" isTruncated>
          {data.name}
        </Value>
        <Value width="20%">Data de proposição</Value>
        <Value width="15%">Data limite</Value>
        <Value width="15%">Programa</Value>
        <Value width="15%">Ministério</Value>
        <Value
          width="5%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <FiChevronDown
            size={theme.sizes[6]}
            style={{
              transition: 'all .2s',
              transform: isOpen ? 'rotate(180deg)' : '',
            }}
          />
        </Value>
      </Flex>

      <Collapse mt={4} isOpen={isOpen}>
        {data.amendments.map(amendment => (
          <AmendmentRow
            key={amendment.id}
            flexDirection={{ xs: 'column', md: 'row' }}
            marginBottom={{ xs: 3, md: 1 }}
          >
            <Value width="30%" isTruncated>
              {amendment.name}
            </Value>
            <Value width="20%">
              {format(amendment.proposition_date, 'dd/MM/yyyy')}
            </Value>
            <Value width="15%">
              {format(amendment.limit_date, 'dd/MM/yyyy')}
            </Value>
            <Value width="15%">
              {format(amendment.program_date, 'dd/MM/yyyy')}
            </Value>
            <Value width="20%" isTruncated>
              {amendment.ministry}
            </Value>
          </AmendmentRow>
        ))}
      </Collapse>
    </Container>
  );
};

export default Row;
