import React from 'react';

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

interface ITaskDetailsModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
}

const TaskDetailsModal: React.FC<ITaskDetailsModalProps> = ({
  isOpen,
  onClose,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />

    <ModalContent borderRadius="md">
      <ModalHeader>Detalhes da tarefa</ModalHeader>
      <ModalCloseButton />

      <ModalBody paddingBottom={4}>
        <Stack spacing={2}>
          <Stack spacing={0}>
            <Heading size="sm">Data limite:</Heading>
            <Text>14/10/2020</Text>
          </Stack>

          <Stack spacing={0}>
            <Heading size="sm">Descrição:</Heading>
            <Text>
              Cadastrar o extrato referente ao mês de setembro de 2020. Obs.:
              Atenção a conta corrente que não é da caixa.
            </Text>
          </Stack>

          <Divider borderColor="gray.400" />

          <Stack as="section" spacing={2} marginTop={2}>
            <Heading size="sm">Histórico:</Heading>

            <Flex
              as="article"
              bg="blue.100"
              borderRadius="sm"
              paddingY={3}
              paddingX={4}
              overflow="hidden"
            >
              <Text color="blue.900" display="flex" alignItems="center">
                01/10/2020
              </Text>

              <Divider
                orientation="vertical"
                borderColor="blue.400"
                marginX={3}
              />

              <Text color="blue.900" textAlign="justify">
                Alerta criado
              </Text>
            </Flex>
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

export default TaskDetailsModal;
