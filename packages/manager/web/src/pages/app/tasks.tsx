import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { FiBell, FiPlus } from 'react-icons/fi';
import { Column, Row } from 'react-table';

import { Box, Button, Tooltip, useDisclosure, useTheme } from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import CreateTaskModal from '@/components/_pages/app/tasks/CreateTaskModal';
import TaskDetailsModal from '@/components/_pages/app/tasks/TaskDetailsModal';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import Title from '@/components/Title';
import { useTasks } from '@/hooks/tasks';
import IFilteredTasksFormatted from '@/interfaces/tasks/IFilteredTasksFormatted';
import ITask from '@/interfaces/tasks/ITask';
import ITaskFormatted from '@/interfaces/tasks/ITaskFormatted';

const COLUMNS = [
  {
    Header: 'Instrumento',
    accessor: 'instrument',
  },
  {
    Header: 'Contrato',
    accessor: 'contract',
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

  const router = useRouter();

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

  const { tasks: _tasks } = useTasks();

  const [activeTaskRow, setActiveTaskRow] = useState<ITaskFormatted>();

  const handleGoToGovernmentPrograms = useCallback(() => {
    router.replace('/app/government-programs');
  }, []);

  const handleOpenCreateTaskModal = useCallback(() => {
    onOpenCreateTask();
  }, []);

  const handleOpenTaskDetailsModal = useCallback((row: Row) => {
    const task = row.original as ITaskFormatted;

    setActiveTaskRow(task);
    onOpenTaskDetails();
  }, []);

  const tasks: IFilteredTasksFormatted = useMemo(() => {
    const filterAndFormat = (list?: ITask[]) =>
      list
        ?.filter(task => !task.last_alert || !task.last_alert?.user_id)
        .map<ITaskFormatted>(task => ({
          ...task,
          date_formatted: format(parseISO(task.date), 'dd/MM/yyyy'),
        })) || [];

    return {
      urgent: filterAndFormat(_tasks?.urgent),
      next: filterAndFormat(_tasks?.next),
    };
  }, [_tasks]);

  return (
    <>
      <SEO
        title="Tarefas"
        image="og/boost.png"
        description="Listagem de tarefas de licitações"
      />

      <Sidebar
        top={
          <Tooltip
            label="Programas do governo"
            aria-label="Programas do governo"
          >
            <Button
              bg="orange.300"
              padding={1}
              borderRadius="50%"
              _hover={{
                bg: 'orange.400',
              }}
              onClick={handleGoToGovernmentPrograms}
            >
              <FiBell size={theme.sizes[6]} color={theme.colors.white} />
            </Button>
          </Tooltip>
        }
        middle={
          <Tooltip label="Criar nova tarefa" aria-label="Criar nova tarefa">
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
          </Tooltip>
        }
      />

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
          <Title>Tarefas urgentes</Title>

          <Table
            columns={COLUMNS}
            data={tasks.urgent}
            pageSize={5}
            onRowClick={handleOpenTaskDetailsModal}
          />
        </Box>

        <Box marginTop={8}>
          <Title>Próximas tarefas</Title>

          <Table
            columns={COLUMNS}
            data={tasks.next}
            pageSize={5}
            onRowClick={handleOpenTaskDetailsModal}
          />
        </Box>
      </Box>
    </>
  );
};

export default App;
