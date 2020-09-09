import IAccountability from '@modules/accountability/models/IAccountability';
import IProposalData from '@modules/proposal_data/models/IProposalData';

export default interface IAgreement {
  agreement_id: string;
  organ: string;
  status: string;
  start_date: string;
  end_date: string;
  program: string;
  data: {
    proposal_data: IProposalData;
    accountability: IAccountability;
  };
}
