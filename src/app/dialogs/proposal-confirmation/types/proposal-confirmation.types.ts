import { ProposalConfirmation } from 'src/app/pages/proposal/types/proposal.types';

export interface ProposalConfirmationDialogData {
  dialogType: ProposalConfirmation;
  photoExists?: boolean;
  expensesExist?: boolean;
  markerExists?: boolean;
}
