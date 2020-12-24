import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';

import {
  Box,
  Button,
  Collapse,
  Input,
  Stack,
  Text,
  Tooltip,
  useTheme,
} from '@chakra-ui/core';
import { format, isValid, parseISO } from 'date-fns';
import { useMedia } from 'use-media';

import Row from '@/components/_pages/app/government-programs/Row';
import SEO from '@/components/SEO';
import Sidebar from '@/components/Sidebar';
import Title from '@/components/Title';
import IGovernmentProgram, {
  IAmendment,
} from '@/interfaces/government-programs/IGovernmentProgram';
import mockGovernmentProgramsData from '@/mocks/government-programs';

const App: React.FC = () => {
  const theme = useTheme();

  const router = useRouter();

  const isWide = useMedia({ minWidth: theme.breakpoints['md'] });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isRowOpen, setIsRowOpen] = useState<string>();

  const [filteredGovernmentPrograms, setFilteredGovernmentPrograms] = useState<
    IGovernmentProgram[]
  >(mockGovernmentProgramsData);

  const handleGoBack = useCallback(() => {
    router.replace('/app/tasks');
  }, []);

  const handleToggleFilters = useCallback(() => {
    setIsFiltersOpen(state => !state);
  }, []);

  const handleFilterByKeyAndValue = useCallback(
    (key: keyof IGovernmentProgram | keyof IAmendment, value: string) => {
      if (!value) {
        setFilteredGovernmentPrograms(mockGovernmentProgramsData);
        return;
      }

      const newGovernmentPrograms = mockGovernmentProgramsData.filter(
        governmentProgram => {
          if (
            governmentProgram.amendments.some(amendment => {
              if (!isValid(new Date(amendment[key]))) {
                return false;
              }

              const formattedDate = format(
                parseISO(amendment[key]),
                'dd/MM/yyyy',
              );

              return formattedDate.includes(value);
            })
          ) {
            return true;
          }

          return (
            String(governmentProgram[key]).includes(value) ||
            governmentProgram.amendments.some(amendment =>
              String(amendment[key]).includes(value),
            )
          );
        },
      );

      setFilteredGovernmentPrograms(newGovernmentPrograms);
    },
    [mockGovernmentProgramsData],
  );

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
        <Box>
          <Title>
            Programas do governo
            <Button
              bg="blue.400"
              marginTop="-10px"
              _hover={{ bg: 'blue.300' }}
              _focusWithin={{ bg: 'blue.300' }}
              onClick={handleToggleFilters}
            >
              <Text color={theme.colors.white} marginRight={2}>
                FILTROS
              </Text>

              <FiChevronDown
                size={theme.sizes[6]}
                color={theme.colors.white}
                style={{
                  marginRight: -3,
                  transition: 'transform .2s',
                  transform: isFiltersOpen ? 'rotate(180deg)' : '',
                }}
              />
            </Button>
          </Title>

          <Collapse isOpen={isFiltersOpen}>
            <Stack
              isInline={isWide}
              marginBottom={4}
              flexDirection={{ xs: 'column', md: 'row' }}
            >
              <Input
                placeholder="Deputado"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  handleFilterByKeyAndValue('name', e.currentTarget.value)
                }
              />
              <Input
                placeholder="Data de proposição"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  handleFilterByKeyAndValue(
                    'proposition_date',
                    e.currentTarget.value,
                  )
                }
              />
              <Input
                placeholder="Data limite"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  handleFilterByKeyAndValue('limit_date', e.currentTarget.value)
                }
              />
              <Input
                placeholder="Programa"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  handleFilterByKeyAndValue('program', e.currentTarget.value)
                }
              />
              <Input
                placeholder="Ministério"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  handleFilterByKeyAndValue('ministry', e.currentTarget.value)
                }
              />
            </Stack>
          </Collapse>
        </Box>

        <Box as="section" width="100%">
          {filteredGovernmentPrograms.map(governmentProgram => (
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
