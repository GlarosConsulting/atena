export interface IAmendment {
  id: string;
  name: string;
  proposition_date: string;
  limit_date: string;
  program: string;
  ministry: string;
}

export default interface IGovernmentProgram {
  id: string;
  name: string;
  amendments: IAmendment[];
}
