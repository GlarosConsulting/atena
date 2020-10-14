import React, { useCallback, useRef } from 'react';
import { FiAlignLeft, FiBookmark, FiHash, FiTag } from 'react-icons/fi';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import DatePicker from '@/components/DatePicker';
import Input from '@/components/Input';
import { useTasks } from '@/hooks/tasks';
import getValidationErrors from '@/utils/getValidationErrors';

interface IFormData {
  instrument: string;
  date: Date;
  status: string;
  task: string;
  details: string;
}

interface ICreateTaskModalProps {
  isOpen: boolean;
  onClose?: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
}

const CreateTaskModal: React.FC<ICreateTaskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const formRef = useRef<FormHandles>(null);

  const toast = useToast();

  const { createTask } = useTasks();

  const handleSubmit = useCallback(async (data: IFormData, event) => {
    console.log('submit', data);

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        instrument: Yup.string().required('Instrumento obrigatório'),
        date: Yup.date().required('Data obrigatória'),
        status: Yup.string().required('Instrumento obrigatório'),
        task: Yup.string().required('Instrumento obrigatório'),
        details: Yup.string().required('Instrumento obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      await createTask(data);

      toast({
        status: 'success',
        title: 'Tarefa criada com sucesso!',
        position: 'top',
        duration: 3000,
      });

      onClose(event);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      console.log(err);

      toast({
        status: 'error',
        title: 'Erro na criação da tarefa',
        description:
          'Ocorreu um erro ao tentar criar a tarefa, tente novamente.',
        position: 'top',
        duration: 5000,
      });
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent borderRadius="md">
        <ModalHeader>Criar tarefa</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Input
              name="instrument"
              icon={FiHash}
              placeholder="Instrumento"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
              }}
            />

            <DatePicker name="date" containerProps={{ marginTop: 3 }} />

            <Input
              name="status"
              icon={FiBookmark}
              placeholder="Fase"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="task"
              icon={FiTag}
              placeholder="Tarefa"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />

            <Input
              name="details"
              icon={FiAlignLeft}
              placeholder="Detalhes"
              containerProps={{
                border: '1px solid',
                borderColor: 'gray.400',
                bg: 'white',
                marginTop: 3,
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose} marginRight={4}>
              Cancelar
            </Button>

            <Button type="submit" variantColor="blue">
              Confirmar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CreateTaskModal;
