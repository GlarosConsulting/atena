export default interface IMainDetails {
  execution_process: string;
  buy_type: string;
  bidding_status: string;
  resource_origin: string;
  financial_resource: string;
  modality: string;
  bidding_type: string;
  process_number: string;
  bidding_number: string;
  object: string;
  legal_foundation: string;
  justification: string;
  bidding_value: number;
  dates: {
    notice_publish_date: Date;
    homologation_date: Date;
    bidding_dates: {
      opening_date: Date;
      closure_date: Date;
    };
  };
  homologation_responsible: {
    cpf_document: string;
    name: string;
    role: string;
  };
  city: {
    name: string;
    state: string;
  };
}
