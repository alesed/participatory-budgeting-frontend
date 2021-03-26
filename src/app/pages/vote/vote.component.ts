import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DetailComponent } from 'src/app/dialogs/detail/detail.component';
import {
  DetailDialogData,
  DetailDialogType,
} from 'src/app/dialogs/detail/types/detail.types';
import { VoteProcessResponse } from 'src/app/dialogs/vote-process/types/vote-process.types';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  DIALOG_HEIGHT,
  DIALOG_WIDTH,
  PAGE_CATEGORIES,
  PAGE_SORTING,
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { VoteGateway } from './gateways/vote-gateway';
import { VoteProject } from './types/vote.types';

const CREATED_PROJECT_SUCCESS =
  'Projekt byl úspěšně vytvořen a zařazen do seznamu!';

const VOTE_SUCCESS = 'Hlas byl projektu úspěšně přidán!';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit {
  _selectedCategory = new FormControl();
  _categories = PAGE_CATEGORIES;

  _selectedSorting = new FormControl(1);
  _sorting = PAGE_SORTING;

  _textSearch = '';

  _voteItems: VoteProject[];
  _filteredVoteItems: VoteProject[] = [];

  constructor(
    public _dialog: MatDialog,
    private _state: AppStateService,
    private _gateway: VoteGateway,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    // empty
  }

  ngOnInit(): void {
    this._loadUncategorizedProjects(this._state.subject.name);
    this._loadNewProjectSnackbar();
  }

  private _loadNewProjectSnackbar(): void {
    this._route.queryParams.subscribe((params) => {
      if (params.new)
        this._snackBar.open(CREATED_PROJECT_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
    });
  }

  /**
   * Get unfiltered projects
   * @param {subjectName} string
   */
  private _loadUncategorizedProjects(subjectName: string): void {
    this._gateway.loadProjects(subjectName).subscribe((data: VoteProject[]) => {
      this._voteItems = [...data];
      this._filterProjectByName();
    });
  }

  /**
   * Get projects filtered by selected values from category dropdown
   * @param {string[]} value
   */
  _getCategorizedProjects(value: string[]): void {
    this._gateway
      .loadProjects(this._state.subject.name, value.toString())
      .subscribe((data: VoteProject[]) => {
        this._voteItems = [...data];
        this._filterProjectByName();
      });
  }

  _filterDo(): void {
    this._filterProjectByName();
  }

  /**
   * On input change of search box filter projects by their name
   */
  private _filterProjectByName(): void {
    if (this._textSearch.length > 0) {
      this._filteredVoteItems = this._voteItems.filter((element) =>
        element.project_name
          .toLowerCase()
          .includes(this._textSearch.toLowerCase())
      );
    } else {
      this._filteredVoteItems = [...this._voteItems];
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
        dialogType: DetailDialogType.Vote,
        projectId: id,
      },
    });

    dialogRef.afterClosed().subscribe((response: VoteProcessResponse) => {
      if (response?.success === true) {
        this._snackBar.open(VOTE_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
    });
  }

  /**
   * Return background color of card depending on decision
   * @param {boolean} decision
   * @returns {CSS background-color property}
   */
  _getDecisionColor(decision: boolean): Record<string, unknown> {
    if (decision === true) {
      return {
        'background-color': `rgb(157 228 157 / 40%)`, // decision -> supported
      };
    } else if (decision === false) {
      return {
        'background-color': `rgb(220 29 29 / 20%)`, // decision -> unsupported
      };
    }
  }
}
