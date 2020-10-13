import React, { useMemo } from 'react';

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
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/core';
import { format, parseISO } from 'date-fns';

import ITask from '@/interfaces/tasks/ITask';
import ITaskAlert from '@/interfaces/tasks/ITaskAlert';

interface ITaskDetailsModalProps {
  task?: ITask;
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
}

type ITaskAlertFormatted = ITaskAlert;

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

  const taskAlertsFormatted = useMemo(
    () =>
      task.alerts.map<ITaskAlertFormatted>(alert => ({
        ...alert,
        date: format(parseISO(alert.date), 'dd/MM/yyyy'),
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
              <Text>{task.date}</Text>
            </Stack>

            <Stack spacing={0}>
              <Heading size="sm">Detalhes:</Heading>
              <Text>{task.details}</Text>
            </Stack>

            <Divider borderColor="gray.400" />

            <Stack as="section" spacing={2} marginTop={2}>
              <Heading size="sm">Histórico:</Heading>

              {taskAlertsFormatted.map(alert => (
                <Flex
                  as="article"
                  bg="blue.100"
                  borderRadius="sm"
                  paddingY={3}
                  paddingX={4}
                  overflow="hidden"
                >
                  <Text color="blue.900" display="flex" alignItems="center">
                    {alert.date}
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
                paddingX={10}
                height={null}
                _hover={{
                  bg: 'blue.800',
                }}
                _focusWithin={{
                  bg: 'blue.800',
                }}
              >
                Tarefa realizada
              </Button>
              <Textarea
                placeholder="Observações"
                borderColor="gray.400"
                color="blue.900"
              />
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;
