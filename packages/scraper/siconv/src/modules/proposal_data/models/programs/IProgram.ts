import IProgramDetails from './IProgramDetails';

export default interface IProgram {
  program_id: string;
  name: string;
  investment_global_value: number;
  details: IProgramDetails;
}
