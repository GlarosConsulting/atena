import { subDays } from 'date-fns';

import { IGovernmentProgram } from '@/interfaces/government-programs/IGovernmentProgram';
import getRandomInt from '@/utils/getRandomInt';

function generateDate() {
  const now = new Date();
  const daysToSubtract = getRandomInt(1, 30);

  return subDays(now, daysToSubtract);
}

export default [
  {
    id: '1',
    name: 'Deputado Fulano de Tal',
    amendments: [
      {
        id: '1',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. das Cidades',
      },
      {
        id: '2',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. das Cidades',
      },
      {
        id: '3',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. das Cidades',
      },
      {
        id: '4',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. das Cidades',
      },
      {
        id: '5',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. das Cidades',
      },
    ],
  },
  {
    id: '2',
    name: 'Deputado Fulano de Tal',
    amendments: [
      {
        id: '1',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Educação',
      },
      {
        id: '2',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. das Cidades',
      },
      {
        id: '3',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. das Cidades',
      },
      {
        id: '4',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Educação',
      },
      {
        id: '5',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Educação',
      },
      {
        id: '6',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Economia',
      },
      {
        id: '7',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Economia',
      },
    ],
  },
  {
    id: '3',
    name: 'Deputado Fulano de Tal',
    amendments: [
      {
        id: '1',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. do Desenvolvimento Regional',
      },
      {
        id: '2',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Saúde',
      },
      {
        id: '3',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Saúde',
      },
      {
        id: '4',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Educação',
      },
      {
        id: '5',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. do Desenvolvimento Regional',
      },
    ],
  },
  {
    id: '4',
    name: 'Deputado Fulano de Tal',
    amendments: [
      {
        id: '1',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. do Desenvolvimento Regional',
      },
      {
        id: '2',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Educação',
      },
      {
        id: '3',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Educação',
      },
      {
        id: '4',
        name: 'Numero_nome_emenda',
        proposition_date: generateDate(),
        limit_date: generateDate(),
        program_date: generateDate(),
        ministry: 'Min. da Educação',
      },
    ],
  },
] as IGovernmentProgram[];
