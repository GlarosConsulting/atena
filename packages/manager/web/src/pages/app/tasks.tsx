import React, { useCallback, useMemo, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Column, Row } from 'react-table';

import { Box, Button, Heading, useDisclosure, useTheme } from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import CreateTaskModal from '@/components/_pages/app/tasks/CreateTaskModal';
import TaskDetailsModal from '@/components/_pages/app/tasks/TaskDetailsModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import { useTasks } from '@/hooks/tasks';
import ITaskFormatted from '@/interfaces/tasks/ITaskFormatted';

const COLUMNS = [
  {
    Header: 'Instrumento',
    accessor: 'instrument',
  },
  {
    Header: 'Data',
    accessor: 'date_formatted',
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

const App: React.FC = () => {
  const theme = useTheme();

  const {
    isOpen: isTaskDetailsOpen,
    onOpen: onOpenTaskDetails,
    onClose: onCloseTaskDetails,
  } = useDisclosure();
  const {
    isOpen: isCreateTaskOpen,
    onOpen: onOpenCreateTask,
    onClose: onCloseCreateTask,
  } = useDisclosure();

  const { tasks } = useTasks();

  const [activeTaskRow, setActiveTaskRow] = useState<ITaskFormatted>();

  const handleOpenCreateTaskModal = useCallback(() => {
    onOpenCreateTask();
  }, []);

  const handleOpenTaskDetailsModal = useCallback((row: Row) => {
    const task = row.original as ITaskFormatted;

    setActiveTaskRow(task);
    onOpenTaskDetails();
  }, []);

  const urgentTasksTableData = useMemo(
    () =>
      tasks?.urgent.map<ITaskFormatted>(task => ({
        ...task,
        date_formatted: format(parseISO(task.date), 'dd/MM/yyyy'),
      })) || [],
    [tasks],
  );

  const nextTasksTableData = useMemo(
    () =>
      tasks?.next.map<ITaskFormatted>(task => ({
        ...task,
        date_formatted: format(parseISO(task.date), 'dd/MM/yyyy'),
      })) || [],
    [tasks],
  );

  return (
    <>
      <SEO
        title="Tarefas"
        image="og/boost.png"
        description="Listagem de tarefas de licitações"
      />

      <Sidebar>
        <Button
          bg="blue.400"
          padding={1}
          borderRadius="50%"
          marginTop={16}
          _hover={{
            bg: 'blue.300',
          }}
          onClick={handleOpenCreateTaskModal}
        >
          <FiPlus size={theme.sizes[8]} color={theme.colors.white} />
        </Button>
      </Sidebar>

      <CreateTaskModal isOpen={isCreateTaskOpen} onClose={onCloseCreateTask} />

      <TaskDetailsModal
        task={activeTaskRow}
        isOpen={isTaskDetailsOpen}
        onClose={() => {
          setActiveTaskRow(null);
          onCloseTaskDetails();
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
