import { GetStaticProps } from 'next';
import React, { useCallback, useMemo, useState } from 'react';
import { Column, Row } from 'react-table';

import { Box, Heading, useDisclosure } from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import TaskDetailsModal from '@/components/_pages/app/tasks/TaskDetailsModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import ITask from '@/interfaces/tasks/ITask';
import fetch from '@/lib/fetch';

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
] as Column[];

type ITaskFormatted = ITask;

interface ITasksResponse {
  urgent: ITask[];
  next: ITask[];
}

interface IAppProps {
  tasks: ITasksResponse;
}

const App: React.FC<IAppProps> = ({ tasks }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeTaskRow, setActiveTaskRow] = useState<ITask>();

  const handleOpenTaskDetailsModal = useCallback((row: Row) => {
    const task = row.original as ITask;

    setActiveTaskRow(task);
    onOpen();
  }, []);

  const urgentTasksTableData = useMemo(
    () =>
      tasks.urgent.map<ITaskFormatted>(task => ({
        ...task,
        date: format(parseISO(task.date), 'dd/MM/yyyy'),
      })),
    [],
  );

  const nextTasksTableData = useMemo(
    () =>
      tasks.next.map<ITaskFormatted>(task => ({
        ...task,
        date: format(parseISO(task.date), 'dd/MM/yyyy'),
      })),
    [],
  );

  return (
    <>
      <SEO
        title="Tarefas"
        image="og/boost.png"
        description="Listagem de tarefas de licitações"
      />

      <Sidebar />

      <TaskDetailsModal
        task={activeTaskRow}
        isOpen={isOpen}
        onClose={() => {
          setActiveTaskRow(null);
          onClose();
        }}
      />

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
            data={urgentTasksTableData}
            marginTop={4}
            onRowClick={handleOpenTaskDetailsModal}
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
            data={nextTasksTableData}
            marginTop={4}
            onRowClick={handleOpenTaskDetailsModal}
          />
        </Box>
      </Box>
    </>
  );
};

export default App;

export const getStaticProps: GetStaticProps<IAppProps> = async () => {
  const response = await fetch<ITasksResponse>('/tasks/filtered');

  return {
    props: {
      tasks: response.data,
    },
    revalidate: 5,
  };
};
