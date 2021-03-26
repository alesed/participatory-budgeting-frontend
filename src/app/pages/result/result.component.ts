import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from 'src/app/dialogs/detail/detail.component';
import {
  DetailDialogData,
  DetailDialogType,
} from 'src/app/dialogs/detail/types/detail.types';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  DIALOG_HEIGHT,
  DIALOG_WIDTH,
  PageSortingEnum,
  PAGE_CATEGORIES,
  PAGE_SORTING,
} from 'src/app/shared/types/shared.types';
import { ResultGateway } from './gateways/result-gateway';
import {
  sortProjectsByName,
  sortProjectsByVotes,
} from './helpers/result-utils';
import { ResultProject } from './types/result.types';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  _selectedCategory = new FormControl();
  _categories = PAGE_CATEGORIES;

  _selectedSorting = new FormControl(1);
  _sorting = PAGE_SORTING;

  _textSearch = '';

  _resultItems: ResultProject[];
  _filteredResultItems: ResultProject[] = [];

  constructor(
    public _dialog: MatDialog,
    private _state: AppStateService,
    private _gateway: ResultGateway
  ) {
    // empty
  }

  ngOnInit(): void {
    this._loadUncategorizedProjects(this._state.subject.name);
  }

  /**
   * Get unfiltered projects
   * @param {subjectName} string
   */
  private _loadUncategorizedProjects(subjectName: string): void {
    this._gateway
      .loadProjects(subjectName)
      .subscribe((data: ResultProject[]) => {
        this._resultItems = [...data];
        this._filterDo();
      });
  }

  /**
   * Get projects filtered by selected values from category dropdown
   * @param {string[]} value
   */
  _loadCategorizedProjects(value: string[]): void {
    this._gateway
      .loadProjects(this._state.subject.name, value.toString())
      .subscribe((data: ResultProject[]) => {
        this._resultItems = [...data];
        this._filterDo();
      });
  }

  _filterDo(): void {
    this._filterProjectByName();
    this._filterProjectBySortingOrder();
  }

  /**
   * Choose one of sorting type and sort already filtered items
   */
  private _filterProjectBySortingOrder(): void {
    switch (this._selectedSorting.value) {
      case PageSortingEnum.VOTES_ASC:
        this._filteredResultItems = sortProjectsByVotes(
          this._filteredResultItems,
          PageSortingEnum.VOTES_ASC
        );
        break;
      case PageSortingEnum.VOTES_DESC:
        this._filteredResultItems = sortProjectsByVotes(
          this._filteredResultItems,
          PageSortingEnum.VOTES_DESC
        );
        break;
      case PageSortingEnum.NAME_ASC:
        this._filteredResultItems = sortProjectsByName(
          this._filteredResultItems,
          PageSortingEnum.NAME_ASC
        );
        break;
      case PageSortingEnum.NAME_DESC:
        this._filteredResultItems = sortProjectsByName(
          this._filteredResultItems,
          PageSortingEnum.NAME_DESC
        );
        break;
    }
  }

  /**
   * On input change of search box filter projects by their name
   */
  private _filterProjectByName(): void {
    if (this._textSearch.length > 0) {
      this._filteredResultItems = this._resultItems.filter((element) =>
        element.project_name
          .toLowerCase()
          .includes(this._textSearch.toLowerCase())
      );
    } else {
      this._filteredResultItems = [...this._resultItems];
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
        dialogType: DetailDialogType.Result,
        projectId: id,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      // empty
    });
  }
}
