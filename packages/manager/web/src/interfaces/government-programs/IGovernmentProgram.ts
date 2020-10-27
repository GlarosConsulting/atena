interface IAmendment {
  id: string;
  name: string;
  proposition_date: Date;
  limit_date: Date;
  program_date: Date;
  ministry: string;
}

export interface IGovernmentProgram {
  id: string;
  name: string;
  amendments: IAmendment[];
}
