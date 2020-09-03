import IMain from './IMain';
import IParticipants from './IParticipants';
import IPrograms from './IPrograms';

export default interface IProposalData {
  main: IMain;
  programs: IPrograms;
  participants: IParticipants;
}
