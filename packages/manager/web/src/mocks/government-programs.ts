import IGovernmentProgram from '@/interfaces/government-programs/IGovernmentProgram';

export default [
  {
    id: '1',
    name: 'Paulo',
    amendments: [
      {
        id: '1',
        name: '2220120200051',
        proposition_date: new Date(2020, 3, 23).toISOString(),
        limit_date: new Date(2020, 12, 18).toISOString(),
        program: '2220120200051',
        ministry: '49000 - MINISTERIO DO DESENVOLVIMENTO AGRARIO',
      },
      {
        id: '2',
        name: '15.244.2217.7k66.002',
        proposition_date: new Date(2020, 2, 18).toISOString(),
        limit_date: new Date(2020, 12, 31).toISOString(),
        program: '2220320200036',
        ministry: '53000 - MINISTERIO DO DESENVOLVIMENTO REGIONAL',
      },
    ],
  },
  {
    id: '2',
    name: 'Fernando',
    amendments: [
      {
        id: '1',
        name: '2040820200004',
        proposition_date: new Date(2020, 11, 12).toISOString(),
        limit_date: new Date(2020, 11, 29).toISOString(),
        program: '2040820200004',
        ministry: '54000 - MINISTERIO DO TURISMO',
      },
      {
        id: '2',
        name: '5320320200012',
        proposition_date: new Date(2020, 11, 11).toISOString(),
        limit_date: new Date(2020, 11, 30).toISOString(),
        program: '5320320200012',
        ministry: '53000 - MINISTERIO DO DESENVOLVIMENTO REGIONAL',
      },
    ],
  },
  {
    id: '3',
    name: 'Luiz',
    amendments: [
      {
        id: '1',
        name: '5320320200010',
        proposition_date: new Date(2020, 9, 29).toISOString(),
        limit_date: new Date(2020, 11, 17).toISOString(),
        program: '5320320200010',
        ministry: '53000 - MINISTERIO DO DESENVOLVIMENTO REGIONAL',
      },
    ],
  },
] as IGovernmentProgram[];
