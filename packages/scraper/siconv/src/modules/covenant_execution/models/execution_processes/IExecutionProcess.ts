import IExecutionProcessDetails from './details';

export default interface IExecutionProcess {
  execution_process_id: string;
  execution_process: string;
  publish_date?: Date;
  process_number: string;
  status: string;
  origin_system_status: string;
  origin_system: string;
  execution_process_accept: string;
  details: IExecutionProcessDetails;
}
