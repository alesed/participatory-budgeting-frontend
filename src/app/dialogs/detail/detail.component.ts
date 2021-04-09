import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResizedEvent } from 'angular-resize-event';
import { forkJoin } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { DetailExpenseComponent } from '../detail-expense/detail-expense.component';
import { VoteProcessResponse } from '../vote-process/types/vote-process.types';
import { VoteProcessComponent } from '../vote-process/vote-process.component';
import { DetailGateway } from './gateways/detail-gateway';
import {
  DetailDialogData,
  DetailDialogType,
  DetailExpensesData,
  DetailPhotoData,
  DetailProjectData,
  DetailResponse,
} from './types/detail.types';

const CARD_DEFAULT_STYLE = { 'background-color': 'white' };
const CARD_SUCCESS_STYLE = { 'background-color': 'rgb(92,184,92,0.4)' };
const CARD_DENIED_STYLE = { 'background-color': 'rgb(240,84,84,0.4)' };

const VOTE_ERROR = 'Při hlasování došlo k chybě!';

const DECISION_SUPPORTED = 'podpořeno:';
const DECISION_DECLINED = 'zamítnuto:';
const DECISION_NOT_DECIDED = 'nerozhodnuto';

const VOTE_BUTTON_TITLE = 'Projekt není podpořen, nelze hlasovat!';

const EDIT_MODE_ENABLED = 'Nyní můžete editovat projekt!';

const PROJECT_SAVED_SUCCESS = 'Projekt je zaslán ke kontrole autorovi!';
const PROJECT_SAVED_ERROR =
  'Projekt nebylo možné změnit, lze provádět pouze jednu změnu v jeden moment!';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  _loading = false;

  _showVoteSection = false;
  _showDecideSection = false;

  _isEditingMode = false;

  _projectData: DetailProjectData;
  _projectPhoto: DetailPhotoData;
  _projectExpenses: DetailExpensesData[];

  _mapHeight: number;

  constructor(
    public _state: AppStateService,
    public _dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailDialogData,
    private _gateway: DetailGateway,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._setupDialogLayout(this.data.dialogType);
    this._loadProjectData(this.data.projectId);
  }

  /**
   * Make elements of dialog visible or hidden depending on dialog type
   * @param {DetailDialogType} dialogType
   */
  private _setupDialogLayout(dialogType: DetailDialogType): void {
    if (dialogType === DetailDialogType.Vote) {
      this._showVoteSection = true;
      this._showDecideSection = false;
    } else if (dialogType === DetailDialogType.Result) {
      this._showVoteSection = false;
      this._showDecideSection = false;
    } else {
      this._showVoteSection = false;
      this._showDecideSection = true;
    }
  }

  /**
   * Seperately load project, project_photo and project_expenses data from DB
   * @param {number} projectId
   */
  private _loadProjectData(projectId: number): void {
    forkJoin([
      this._gateway.loadDetailProjectData(projectId),
      this._gateway.loadDetailProjectPhotoData(projectId),
      this._gateway.loadDetailProjectExpensesData(projectId),
    ]).subscribe((data) => {
      this._projectData = data[0];
      this._projectPhoto = data[1] ? data[1][0] : null;
      this._projectExpenses = data[2];
    });
  }

  /**
   * Set background color of row depending on decision
   * @param {boolean} decision
   * @returns {style record}
   */
  _getCurrentDecisionColor(): Record<string, unknown> {
    if (this._projectData.decision === true) return CARD_SUCCESS_STYLE;
    if (this._projectData.decision === false) return CARD_DENIED_STYLE;
    return CARD_DEFAULT_STYLE;
  }

  /**
   * Close dialog and optionaly pass data to component which opened this dialog
   */
  _closeDialog(): void {
    this._dialogRef.close();
  }

  /**
   * Update state of current project with new decision (including text) and reload dialog with fresh data
   * @param {boolean} decision
   */
  _decideProject(decision: boolean): void {
    this._gateway
      .updateProjectDecision(
        this.data.projectId,
        decision,
        this._projectData.decision_text
      )
      .subscribe((result: DetailResponse) => {
        if (result.success) {
          this._loadProjectData(this.data.projectId);
          this._dialogRef.close(true);
        } else {
          this._dialogRef.close(false);
        }
      });
  }

  /**
   * Open vote dialog and after successful vote close this dialog (detail)
   * Error means opening snackbar and detail stay opened
   */
  _openVoteDialog(): void {
    const dialogRef = this._dialog.open(VoteProcessComponent, {
      maxWidth: 450,
      disableClose: false,
      data: this.data.projectId,
    });

    dialogRef.afterClosed().subscribe((response: VoteProcessResponse) => {
      if (response?.success === true) {
        this._dialogRef.close(response);
        return;
      } else if (response?.success === false) {
        this._snackBar.open(VOTE_ERROR + response.message, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
    });
  }

  /**
   * Depending on decision state return title of decision input
   * @returns {string}
   */
  _getDecisionText(): string {
    if (this._projectData.decision === true) return DECISION_SUPPORTED;
    else if (this._projectData.decision === false) return DECISION_DECLINED;
    else return DECISION_NOT_DECIDED;
  }

  /**
   * Depending on voting state return title of button
   * @returns {string}
   */
  _getVoteButtonTitle(): string {
    return !this._state.canVote || !this._projectData.decision
      ? VOTE_BUTTON_TITLE
      : '';
  }

  /**
   * Modify map height depending on curret height (every time size changes)
   * @param sizeEvent
   */
  _onMapResized(sizeEvent: ResizedEvent): void {
    const newHeight = sizeEvent.newHeight - 15.34;

    this._mapHeight = newHeight < 140 ? 140 : newHeight;
  }

  /**
   * Enable admin to change data of project and warn with snackbar
   */
  _enableEditingMode(): void {
    this._isEditingMode = true;

    this._snackBar.open(EDIT_MODE_ENABLED, SNACKBAR_CLOSE, {
      duration: SNACKBAR_DURATION,
      panelClass: SNACKBAR_CLASS,
    });
  }

  /**
   * Save edited inputs to DB and show status snackbar
   */
  _saveEditedProject(): void {
    this._loading = true;
    this._gateway
      .sendProjectUpdateAcceptation(
        this._state.subject.name,
        this._projectData,
        this._projectExpenses
      )
      .subscribe((response: DetailResponse) => {
        this._loading = false;
        this._isEditingMode = false;

        if (response.success === true) {
          this._snackBar.open(PROJECT_SAVED_SUCCESS, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        } else {
          this._snackBar.open(PROJECT_SAVED_ERROR, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        }
      });
  }

  /**
   * Edit expense by opening dialog with selected expense
   */
  _editExpense(expense: DetailExpensesData): void {
    const expenseIndex = this._projectExpenses.findIndex(
      (element) => element === expense
    );

    const dialogRef = this._dialog.open(DetailExpenseComponent, {
      disableClose: false,
      data: {
        data: [...this._projectExpenses],
        element: JSON.parse(JSON.stringify(expense)),
        index: expenseIndex,
      },
    });

    dialogRef.afterClosed().subscribe((result: DetailExpensesData[]) => {
      if (result) this._projectExpenses = [...result];
    });
  }
}
