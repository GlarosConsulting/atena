import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { Box, Button, Tooltip, useTheme } from '@chakra-ui/core';

import Row from '@/components/_pages/app/government-programs/Row';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Title from '@/components/Title';
import mockGovernmentProgramsData from '@/mocks/government-programs';

const App: React.FC = () => {
  const theme = useTheme();

  const router = useRouter();

  const [isRowOpen, setIsRowOpen] = useState<string>();

  const handleGoBack = useCallback(() => {
    router.replace('/app/tasks');
  }, []);

  const handleOpenRow = useCallback(
    (id: string) => {
      if (isRowOpen === id) {
        setIsRowOpen(undefined);
        return;
      }

      setIsRowOpen(id);
    },
    [isRowOpen],
  );

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
        <Title>Programas do governo</Title>

        <Box as="section" width="100%">
          {mockGovernmentProgramsData.map(governmentProgram => (
            <Row
              key={governmentProgram.id}
              data={governmentProgram}
              isOpen={isRowOpen === governmentProgram.id}
              onClick={() => handleOpenRow(governmentProgram.id)}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default App;
