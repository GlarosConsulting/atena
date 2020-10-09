import React from 'react';

import { Box, Heading, useDisclosure } from '@chakra-ui/core';

import TaskDetailsModal from '@/components/_pages/app/tasks/TaskDetailsModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';

const COLUMNS = [
  {
    Header: 'Instrumento',
    accessor: 'instrument',
  },
  {
    Header: 'Data',
    accessor: 'date',
  },
  {
    Header: 'Fase',
    accessor: 'status',
  },
  {
    Header: 'Tarefa',
    accessor: 'task',
  },
  {
    Header: 'Detalhes',
    accessor: 'details',
  },
];

const App: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <SEO title="Tarefas" />

      <Sidebar />

      <TaskDetailsModal isOpen={isOpen} onClose={onClose} />

      <Box as="section" marginLeft={24} marginY={6} paddingRight={8}>
        <Box>
          <Heading
            size="lg"
            borderBottom="1px solid"
            borderBottomColor="gray.300"
            paddingBottom={2}
          >
            Tarefas urgentes
          </Heading>

          <Table
            columns={COLUMNS}
            data={[
              {
                instrument: '864230/2018',
                date: '10/10/2020',
                status: 'Execução',
                task: 'Contrato/Subconvênio',
                details: 'Cadastrar propostas da empresa',
              },
              {
                instrument: '864230/2018',
                date: '14/10/2020',
                status: 'Prestação de contas',
                task: 'Movimentações financeiras',
                details: 'Cadastrar extratos',
              },
              {
                instrument: '500230/2018',
                date: '14/10/2020',
                status: 'Execução',
                task: 'Movimentações financeiras',
                details: 'Cadastrar ART',
              },
              {
                instrument: '864230/2018',
                date: '14/10/2020',
                status: 'Prestação de contas',
                task: 'Movimentações financeiras',
                details: 'Cadastrar orçamento',
              },
            ]}
            marginTop={4}
            onRowClick={() => {
              onOpen();
            }}
          />
        </Box>

        <Box marginTop={8}>
          <Heading
            size="lg"
            borderBottom="1px solid"
            borderBottomColor="gray.300"
            paddingBottom={2}
          >
            Próximas tarefas
          </Heading>

          <Table
            columns={COLUMNS}
            data={[
              {
                instrument: '864230/2018',
                date: '20/10/2020',
                status: 'Execução',
                task: 'Contrato/Subconvênio',
                details: 'Cadastrar medições da obra',
              },
              {
                instrument: '864230/2018',
                date: '13/11/2020',
                status: 'Prestação de contas',
                task: 'Movimentos financeiras',
                details: 'Cadastrar extratos',
              },
              {
                instrument: '864230/2018',
                date: '20/11/2020',
                status: 'Prestação de contas',
                task: 'Movimentos financeiras',
                details: 'Executar lançamentos',
              },
            ]}
            marginTop={4}
          />
        </Box>
      </Box>
    </>
  );
};

export default App;
