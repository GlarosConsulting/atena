export default interface IMainData {
  modality: string;
  sent: string;
  siafi_status: string;
  hiring_status: string;
  status: {
    value: string;
    committed: string;
    publication: string;
  };
  proposal_id: string;
  organ_intern_id: string;
  process_id: string;
}
