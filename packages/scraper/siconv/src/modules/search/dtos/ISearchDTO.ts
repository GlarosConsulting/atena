export enum By {
  CNPJ,
}

export default interface ISearchDTO {
  by: By;
  value: string;
}
