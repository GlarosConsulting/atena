import React, { useState } from 'react';

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
} from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import ITaskAlert from '@/interfaces/tasks/ITaskAlert';
import ITaskFormatted from '@/interfaces/tasks/ITaskFormatted';
import api from '@/services/api';

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

  const [alerts, setAlerts] = useState(() =>
    task.alerts.map<ITaskAlertFormatted>(alert => ({
      ...alert,
      date_formatted: format(parseISO(alert.date), 'dd/MM/yyyy'),
    })),
  );

  const [isAccomplishingTask, setIsAccomplishingTask] = useState(false);
  const [observation, setObservation] = useState('');

  function handleTextareaChange(event: React.ChangeEvent<HTMLInputElement>) {
    setObservation(event.target.value);
  }

  async function handleAccomplishTask() {
    setIsAccomplishingTask(true);

    console.log(observation);

    const response = await api.post<ITaskAlert>(`/tasks/${task.id}/alerts`, {
      date: new Date(),
      description: observation,
    });

    const newAlert: ITaskAlertFormatted = {
      ...response.data,
      date_formatted: format(parseISO(response.data.date), 'dd/MM/yyyy'),
    };

    setAlerts([...alerts, newAlert]);

    setIsAccomplishingTask(false);
    setObservation('');
  }

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
