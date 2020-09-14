import IAcceptDataDetails from './IAcceptDataDetails';
import IMainDetails from './IMainDetails';

export default interface IExecutionProcessDetails {
  main_details: IMainDetails;
  accept_data_details: IAcceptDataDetails;
}
