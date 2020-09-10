export default interface IDates {
  proposal_date: Date;
  signature_date: Date;
  published_dou_date: Date;
  validity: {
    start_date: Date;
    end_date: Date;
  };
  accountability_limit_date: Date;
}
