import { FormGroup } from '@angular/forms';
import {
  ProposalConfirmation,
  ProposalExpense,
  ProposalMapMarker,
} from 'src/app/pages/proposal/types/proposal.types';

export interface ProposalConfirmationDialogData {
  dialogType: ProposalConfirmation;
  photoExists?: boolean;
  expensesExist?: boolean;
  markerExists?: boolean;

  uploadedFile?: File;
  proposalForm?: FormGroup;
  expenses?: ProposalExpense[];
  mapMarker?: ProposalMapMarker;
}
