export default interface IProgramDetails {
  program_id: string;
  program_name: string;
  cps_number?: string;
  investment_items: string;
  counterpart_rule: string;
  values: {
    investment_items_global_value: number;
    counterpart_values: {
      total_value: number;
      financial_value: number;
      assets_services_value: number;
    };
    transfer_values: {
      total_value: number;
      amendment_value: string;
    };
  };
}
