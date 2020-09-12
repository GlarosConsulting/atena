export default interface IValues {
  global_value: number;
  transfer_value: number;
  counterpart_values: {
    total_value: number;
    financial_value: number;
    assets_services_value: number;
  };
  income_value: number;
}
