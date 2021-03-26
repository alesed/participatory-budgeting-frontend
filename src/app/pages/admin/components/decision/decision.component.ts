import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetailComponent } from 'src/app/dialogs/detail/detail.component';
import {
  DetailDialogData,
  DetailDialogType,
} from 'src/app/dialogs/detail/types/detail.types';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { DecisionGateway } from './gateways/decision-gateway';
import {
  DecisionFilterCategory,
  DecisionProject,
} from './types/decision.types';

const DIALOG_WIDTH = '90%';
const DIALOG_HEIGHT = '90%';

const CARD_SUCCESS_STYLE = { 'background-color': 'rgb(92,184,92,0.4)' };
const CARD_DENIED_STYLE = { 'background-color': 'rgb(240,84,84,0.4)' };
const CARD_DEFAULT_STYLE = { 'background-color': 'rgb(240,239,239,0.6)' };

const DECISION_SUCCESS = 'Rozhodnutí projektu úspěšně změněno!';
const DECISION_ERROR = 'Při rozhodování projektu došlo k chybě!';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.scss'],
})
export class DecisionComponent implements OnInit {
  _selectedCategory = new FormControl(DecisionFilterCategory.All);
  _categories = [
    { name: 'Všechny projekty', value: DecisionFilterCategory.All },
    { name: 'Projekty k rozhodnutí', value: DecisionFilterCategory.NotDecided },
    { name: 'Podpořené projekty', value: DecisionFilterCategory.Supported },
    { name: 'Zamítnuté projekty', value: DecisionFilterCategory.Denied },
  ];

  _textSearch = '';

  _decisionItems: DecisionProject[];
  _filteredDecisionItems: DecisionProject[] = [];

  constructor(
    public _dialog: MatDialog,
    private _state: AppStateService,
    private _gateway: DecisionGateway,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._getProjects(this._state.subject.name);
  }

  /**
   * Get unfiltered projects
   * @param {string} subjectName
   */
  private _getProjects(subjectName): void {
    this._gateway.loadDecisionProjectData(subjectName).subscribe((result) => {
      this._decisionItems = result;
      this._filterDo();
    });
  }

  _filterDo(): void {
    this._filterProjectsByDecision();
    this._filterProjectsByName();
  }

  /**
   * Filter projects by selected decision from decision dropdown
   */
  private _filterProjectsByDecision(): void {
    this._filteredDecisionItems = this._decisionItems.filter((item) =>
      this._decideProjectVisibility(item.decision)
    );
  }

  /**
   * On input change of search box filter projects by their name
   */
  private _filterProjectsByName(): void {
    if (this._textSearch.length > 0) {
      this._filteredDecisionItems = this._filteredDecisionItems.filter(
        (element) =>
          element.project_name
            .toLowerCase()
            .includes(this._textSearch.toLowerCase())
      );
    } else {
      this._filteredDecisionItems = [...this._filteredDecisionItems];
    }
  }

  /**
   * Decide if row is visible (three possible states)
   * @param {boolean} decision
   * @returns {boolean}
   */
  private _decideProjectVisibility(decision: boolean): boolean {
    switch (this._selectedCategory.value) {
      case DecisionFilterCategory.NotDecided:
        return decision === null;
      case DecisionFilterCategory.Supported:
        return decision === true;
      case DecisionFilterCategory.Denied:
        return decision === false;
      default:
        return true;
    }
  }

  /**
   * Open dialog which contains selected project info
   * @param {number} id
   */
  _openItemDetail(id: number): void {
    const dialogRef = this._dialog.open(DetailComponent, {
      width: DIALOG_WIDTH,
      height: DIALOG_HEIGHT,
      disableClose: false,
      data: <DetailDialogData>{
        dialogType: DetailDialogType.Admin,
        projectId: id,
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this._getProjects(this._state.subject.name);
        this._snackBar.open(DECISION_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      } else if (success === false) {
        this._snackBar.open(DECISION_ERROR, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
    });
  }

  /**
   * Set background color of row depending on decision
   * @param {boolean} decision
   * @returns {style record}
   */
  _getCurrentColor(decision: boolean): Record<string, unknown> {
    if (decision === true) return CARD_SUCCESS_STYLE;
    if (decision === false) return CARD_DENIED_STYLE;
    return CARD_DEFAULT_STYLE;
  }
}
