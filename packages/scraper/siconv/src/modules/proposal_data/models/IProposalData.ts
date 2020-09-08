import IMain from './main';
import IParticipants from './participants';
import IPrograms from './programs';

export default interface IProposalData {
  main: IMain;
  programs: IPrograms;
  participants: IParticipants;
}
