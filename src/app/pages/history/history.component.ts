import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DetailComponent } from 'src/app/dialogs/detail/detail.component';
import {
  DetailDialogData,
  DetailDialogType,
} from 'src/app/dialogs/detail/types/detail.types';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  PageSortingEnum,
  PAGE_CATEGORIES,
  PAGE_SORTING,
} from 'src/app/shared/types/shared.types';
import {
  sortProjectsByName,
  sortProjectsByVotes,
} from '../result/helpers/result-utils';
import { HistoryGateway } from './gateways/history-gateway';
import { HistoryProject } from './types/history.types';

const DIALOG_WIDTH = '90%';
const DIALOG_HEIGHT = '90%';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  _year: number;

  _selectedCategory = new FormControl();
  _categories = PAGE_CATEGORIES;

  _selectedSorting = new FormControl(1);
  _sorting = PAGE_SORTING;

  _textSearch = '';

  _historyItems: HistoryProject[];
  _filteredHistoryItems: HistoryProject[];

  constructor(
    public _dialog: MatDialog,
    private _state: AppStateService,
    private _gateway: HistoryGateway,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    // empty
  }

  ngOnInit(): void {
    this._getHistoricalYear();
    this._loadUncategorizedProjects(this._state.subject.name, this._year);

    this._router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this._getHistoricalYear();

        this._selectedCategory.value?.length &&
        this._selectedCategory.value?.length > 0
          ? this._loadCategorizedProjects(
              this._selectedCategory.value,
              this._year
            )
          : this._loadUncategorizedProjects(
              this._state.subject.name,
              this._year
            );

        this._filterDo();
      }
    });
  }

  private _getHistoricalYear(): void {
    this._year = this._activatedRoute.snapshot.params['year'];
  }

  /**
   * Get unfiltered projects
   * @param {subjectName} string
   */
  private _loadUncategorizedProjects(subjectName: string, year: number): void {
    this._gateway
      .loadProjects(subjectName, year)
      .subscribe((data: HistoryProject[]) => {
        this._historyItems = [...data];
        this._filterDo();
      });
  }

  /**
   * Get projects filtered by selected values from category dropdown
   * @param {string[]} value
   */
  _loadCategorizedProjects(value: string[], year: number): void {
    this._gateway
      .loadProjects(this._state.subject.name, year, value.toString())
      .subscribe((data: HistoryProject[]) => {
        this._historyItems = [...data];
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
  _filterProjectBySortingOrder(): void {
    switch (this._selectedSorting.value) {
      case PageSortingEnum.VOTES_ASC:
        this._filteredHistoryItems = sortProjectsByVotes(
          this._filteredHistoryItems,
          PageSortingEnum.VOTES_ASC
        );
        break;
      case PageSortingEnum.VOTES_DESC:
        this._filteredHistoryItems = sortProjectsByVotes(
          this._filteredHistoryItems,
          PageSortingEnum.VOTES_DESC
        );
        break;
      case PageSortingEnum.NAME_ASC:
        this._filteredHistoryItems = sortProjectsByName(
          this._filteredHistoryItems,
          PageSortingEnum.NAME_ASC
        );
        break;
      case PageSortingEnum.NAME_DESC:
        this._filteredHistoryItems = sortProjectsByName(
          this._filteredHistoryItems,
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
      this._filteredHistoryItems = this._historyItems.filter((element) =>
        element.project_name
          .toLowerCase()
          .includes(this._textSearch.toLowerCase())
      );
    } else {
      this._filteredHistoryItems = [...this._historyItems];
    }
  }

  /**
   * Open dialog which contains selected project info (historical)
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
