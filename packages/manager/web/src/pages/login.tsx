import NextLink from 'next/link';
import React, { useCallback, useRef } from 'react';
import { FiLock, FiMail } from 'react-icons/fi';

import { Button, Flex, Heading, Link } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Input from '@/components/Input';
import SEO from '@/components/SEO';

const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(() => {
    console.log('submit');
  }, []);

  return (
    <>
      <SEO title="Atena Gestor" image="og/boost.png" shouldExcludeTitleSuffix />

      <Flex
        as="main"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          backgroundColor="blue.200"
          borderRadius="md"
          flexDirection="column"
          alignItems="stretch"
          padding={16}
        >
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Heading marginBottom={6}>Login</Heading>

            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button
              type="submit"
              bg="blue.400"
              color="gray.800"
              _hover={{
                bg: 'blue.500',
                color: 'gray.900',
              }}
              _focusWithin={{
                bg: 'blue.500',
                color: 'gray.900',
              }}
              width="100%"
              marginY={4}
              paddingY={6}
            >
              Entrar
            </Button>

            <NextLink href="forgot-password">
              <Link color="blue.900">Esqueci minha senha</Link>
            </NextLink>
          </Form>
        </Flex>
      </Flex>
    </>
  );
};

export default Login;
