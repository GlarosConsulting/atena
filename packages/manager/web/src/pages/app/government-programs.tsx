import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { Box, Button, Tooltip, useTheme } from '@chakra-ui/core';

import Row, { Value } from '@/components/_pages/app/government-programs/Row';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';

const App: React.FC = () => {
  const theme = useTheme();

  const router = useRouter();

  const handleGoBack = useCallback(() => {
    router.replace('/app/tasks');
  }, []);

  return (
    <>
      <SEO
        title="Programas do governo"
        image="og/boost.png"
        description="Listagem de programas do governo"
      />

      <Sidebar
        top={
          <Tooltip label="Voltar" aria-label="Voltar">
            <Button
              bg="blue.400"
              padding={1}
              borderRadius="50%"
              _hover={{
                bg: 'blue.300',
              }}
              onClick={handleGoBack}
            >
              <FiArrowLeft size={theme.sizes[6]} color={theme.colors.white} />
            </Button>
          </Tooltip>
        }
      />

      <Box marginLeft={24} marginY={6} paddingRight={8}>
        <Box width="100%">
          <Row>
            <Value width="20%">Teste</Value>
            <Value width="20%">123</Value>
          </Row>
          <Row />
        </Box>
      </Box>
    </>
  );
};

export default App;
