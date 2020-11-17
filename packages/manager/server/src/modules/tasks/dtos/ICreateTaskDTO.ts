export default interface ICreateTaskDTO {
  instrument: string;
  contract: string;
  date: Date;
  status: string;
  task: string;
  details: string;
}
