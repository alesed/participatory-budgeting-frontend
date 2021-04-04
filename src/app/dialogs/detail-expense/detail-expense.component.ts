import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailExpensesData } from '../detail/types/detail.types';
import { DetailExpenseInputData } from './types/detail-expense.types';

@Component({
  selector: 'app-detail-expense',
  templateUrl: './detail-expense.component.html',
  styleUrls: ['./detail-expense.component.scss'],
})
export class DetailExpenseComponent implements OnInit {
  _expense: DetailExpensesData;
  _projectExpenses: DetailExpensesData[];

  constructor(
    public _dialogRef: MatDialogRef<DetailExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailExpenseInputData
  ) {}

  ngOnInit(): void {
    this._expense = this.data.element;
    this._projectExpenses = this.data.data;
  }

  /**
   * If user wants to rewrite expense, return new project expenses
   * @param {boolean} decision
   */
  _closeDialog(decision: boolean): void {
    if (decision === true) {
      this._changeDataAccordingToInput();
      this._dialogRef.close(this._projectExpenses);
    } else {
      this._dialogRef.close(null);
    }
  }

  /**
   * Change whole array of expenses with new element
   */
  private _changeDataAccordingToInput(): void {
    this._projectExpenses[this.data.index] = this._expense;
  }
}
