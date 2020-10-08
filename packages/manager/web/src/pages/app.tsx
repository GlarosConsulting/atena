import React from 'react';

import { Box, Heading } from '@chakra-ui/core';

import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';

const App: React.FC = () => (
  <>
    <Sidebar />

    <Box marginLeft={24} marginTop={6} paddingRight={8}>
      <Box>
        <Heading
          size="lg"
          color="gray.700"
          borderBottom="1px solid"
          borderBottomColor="gray.300"
          paddingBottom={2}
        >
          Tarefas urgentes
        </Heading>

        <Table
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
            },
          ]}
          data={[
            {
              name: 'Test',
            },
          ]}
          marginTop={4}
        />
      </Box>

      <Box marginTop={8}>
        <Heading
          size="lg"
          color="gray.700"
          borderBottom="1px solid"
          borderBottomColor="gray.300"
          paddingBottom={2}
        >
          Próximas tarefas
        </Heading>

        <Table
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
            },
          ]}
          data={[
            {
              name: 'Test',
            },
          ]}
          marginTop={4}
        />
      </Box>
    </Box>
  </>
);

export default App;
