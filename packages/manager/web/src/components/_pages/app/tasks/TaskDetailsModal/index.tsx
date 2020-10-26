import React, { useCallback, useMemo, useState } from 'react';

import {
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import { useAuthentication } from '@/hooks/authentication';
import { useTasks } from '@/hooks/tasks';
import ITaskAlert from '@/interfaces/tasks/ITaskAlert';
import ITaskFormatted from '@/interfaces/tasks/ITaskFormatted';

interface ITaskDetailsModalProps {
  task?: ITaskFormatted;
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
}

interface ITaskAlertFormatted extends ITaskAlert {
  date_formatted: string;
}

const TaskDetailsModal: React.FC<ITaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  if (!task) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent borderRadius="md">
          <ModalHeader>Detalhes da tarefa</ModalHeader>
          <ModalCloseButton />

          <ModalBody paddingBottom={4}>
            <Text>Carregando...</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const toast = useToast();

  const { user } = useAuthentication();
  const { addAlertToTask } = useTasks();

  const [isAccomplishingTask, setIsAccomplishingTask] = useState(false);
  const [observation, setObservation] = useState('');

  function handleTextareaChange(event: React.ChangeEvent<HTMLInputElement>) {
    setObservation(event.target.value);
  }

  const handleAccomplishTask = useCallback(
    async event => {
      setIsAccomplishingTask(true);

      const [alert] = await addAlertToTask(task.id, {
        user_id: user.id,
        description: observation,
      });

      if (!alert) {
        setIsAccomplishingTask(false);

        toast({
          status: 'error',
          title: 'Erro ao realizar tarefa',
          description: 'Ocorreu um erro ao criar o alerta, tente novamente.',
          position: 'top',
          duration: 5000,
        });

        return;
      }

      toast({
        status: 'success',
        title: 'Tarefa realizada com sucesso',
        description:
          'Alerta criado com sucesso, e a tarefa foi retirada da lista.',
        position: 'top',
        duration: 3000,
      });

      onClose(event, 'pressedEscape');
    },
    [observation],
  );

  const alerts = useMemo(
    () =>
      task.alerts.map<ITaskAlertFormatted>(alert => ({
        ...alert,
        date_formatted: format(parseISO(alert.date), 'dd/MM/yyyy'),
      })),
    [],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent borderRadius="md">
        <ModalHeader>Detalhes da tarefa</ModalHeader>
        <ModalCloseButton />

        <ModalBody paddingBottom={4}>
          <Stack spacing={2}>
            <Stack spacing={0}>
              <Heading size="sm">Data:</Heading>
              <Text>{task.date_formatted}</Text>
            </Stack>

            <Stack spacing={0}>
              <Heading size="sm">Detalhes:</Heading>
              <Text>{task.details}</Text>
            </Stack>

            <Divider borderColor="gray.400" />

            <Stack as="section" spacing={2} marginTop={2}>
              <Heading size="sm">Histórico:</Heading>

              {alerts.map(alert => (
                <Flex
                  as="article"
                  bg="blue.100"
                  borderRadius="sm"
                  paddingY={3}
                  paddingX={4}
                  overflow="hidden"
                >
                  <Text color="blue.900" display="flex" alignItems="center">
                    {alert.date_formatted}
                  </Text>

                  <Divider
                    orientation="vertical"
                    borderColor="blue.400"
                    marginX={3}
                  />

                  <Text color="blue.900" textAlign="justify">
                    {alert.description}
                  </Text>
                </Flex>
              ))}
            </Stack>

            <Divider borderColor="gray.400" />

            <Flex marginTop={2}>
              <Button
                bg="blue.900"
                color="white"
                marginRight={2}
                paddingX={isAccomplishingTask ? 0 : 10}
                width={isAccomplishingTask ? 32 : 'auto'}
                height={null}
                isDisabled={isAccomplishingTask}
                _hover={{
                  bg: 'blue.800',
                }}
                _focusWithin={{
                  bg: 'blue.800',
                }}
                onClick={handleAccomplishTask}
              >
                {isAccomplishingTask ? <Spinner /> : 'Tarefa realizada'}
              </Button>

              <Textarea
                placeholder="Observações"
                borderColor="gray.400"
                color="blue.900"
                value={observation}
                onChange={handleTextareaChange}
              />
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;
