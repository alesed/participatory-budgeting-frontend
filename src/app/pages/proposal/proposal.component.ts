import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ResizedEvent } from 'angular-resize-event';
import { ImageSizeWarningComponent } from 'src/app/dialogs/image-size-warning/image-size-warning.component';
import { ProposalConfirmationComponent } from 'src/app/dialogs/proposal-confirmation/proposal-confirmation.component';
import { ProposalConfirmationDialogData } from 'src/app/dialogs/proposal-confirmation/types/proposal-confirmation.types';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  PAGE_CATEGORIES,
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { PolygonGateway } from '../admin/components/polygon/gateways/polygon-gateway';
import {
  PolygonCoord,
  PolygonCoordsData,
} from '../admin/components/polygon/types/polygon.types';
import {
  ProposalConfirmation,
  ProposalExpense,
  ProposalMapMarker,
} from './types/proposal.types';

const DIALOG_WIDTH = '300px';
const FILE_MAX_SIZE = 1575000;

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

const PROPOSAL_ERROR = 'Při vytváření projektu došlo k chybě!';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent implements OnInit {
  _proposalForm = new FormGroup({
    projectName: new FormControl(null, [
      Validators.required,
      Validators.maxLength(150),
    ]),
    author: new FormControl(null, [
      Validators.required,
      Validators.maxLength(150),
    ]),
    authorEmail: new FormControl(null, [
      Validators.required,
      Validators.email,
      Validators.maxLength(100),
    ]),
    category: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [
      Validators.required,
      Validators.maxLength(1500),
    ]),
  });

  _categories = PAGE_CATEGORIES;

  _expenses: ProposalExpense[] = [];
  _expenseName: string;
  _expenseCost: number;

  _mapHeight: number;
  _mapMarker: ProposalMapMarker;

  _mapLat = 49.194714576087954;
  _mapLng = 16.609002278955533;

  _uploadedFile: File;

  _polygonCoords: PolygonCoord[] = [];

  constructor(
    private _polygonGateway: PolygonGateway,
    public _dialog: MatDialog,
    private _router: Router,
    private _state: AppStateService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._polygonGateway
      .getCurrentPolygon(this._state.subject.name)
      .subscribe((result: PolygonCoordsData) => {
        if (result && result.center) {
          this._getCurrentPosition(result.center);
          this._setPolygonOnMap(result.coords);
        }
      });
  }

  /**
   * After retrieved center of subject polygon set center of map
   * @param {PolygonCoord} polygonCenter
   */
  private _getCurrentPosition(polygonCenter: PolygonCoord): void {
    this._mapLat = polygonCenter.lat;
    this._mapLng = polygonCenter.lng;
  }

  /**
   * After retrieved polygon of subject set it on map
   * @param {PolygonCoord[]} polygonCoords
   */
  private _setPolygonOnMap(polygonCoords: PolygonCoord[]): void {
    this._polygonCoords = [...polygonCoords];
  }

  /**
   * Open confirmation dialog to send proposal
   */
  _sendProposal(): void {
    const dialogRef = this._dialog.open(ProposalConfirmationComponent, {
      width: DIALOG_WIDTH,
      disableClose: true,
      data: <ProposalConfirmationDialogData>{
        dialogType: ProposalConfirmation.Send,
        photoExists: !!this._uploadedFile,
        expensesExist: this._expenses.length > 0,
        markerExists: !!this._mapMarker,

        uploadedFile: this._uploadedFile,
        proposalForm: this._proposalForm,
        mapMarker: this._mapMarker,
        expenses: this._expenses,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this._router.navigate([this._state.subject.name, 'vote'], {
          queryParams: { new: true },
        });
      } else if (result === false) {
        this._snackBar.open(PROPOSAL_ERROR, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
    });
  }

  /**
   * Confirmation dialog if user wants to reset inputs of proposal page
   */
  _discardProposal(): void {
    const dialogRef = this._dialog.open(ProposalConfirmationComponent, {
      width: DIALOG_WIDTH,
      disableClose: true,
      data: <ProposalConfirmationDialogData>{
        dialogType: ProposalConfirmation.Discard,
      },
    });

    dialogRef.afterClosed().subscribe((result: ProposalConfirmation) => {
      if (result === ProposalConfirmation.Discard)
        this._initializeProposalForm();
    });
  }

  /**
   * Reload page if user confirm discard dialog
   */
  private _initializeProposalForm(): void {
    window.location.reload();
  }

  /**
   * Prepare selected file (compress and save to variable)
   * @param {EventTarget} inputFiles
   */
  _uploadFile(inputFiles: EventTarget): void {
    const uploadedImg = (inputFiles as HTMLInputElement).files[0];

    const isAllowedType = ALLOWED_FILE_TYPES.includes(uploadedImg?.type);

    if (uploadedImg.size > FILE_MAX_SIZE || !isAllowedType) {
      this._openImgWarningDialog(uploadedImg.size, isAllowedType);
      return;
    }

    this._uploadedFile = uploadedImg;
  }

  /**
   * Open warning dialog if type or size is incorrect
   * @param {number} size
   * @param {boolean} allowedType
   */
  private _openImgWarningDialog(size: number, allowedType: boolean): void {
    this._dialog.open(ImageSizeWarningComponent, {
      width: DIALOG_WIDTH,
      disableClose: true,
      data: { size, allowedType, FILE_MAX_SIZE },
    });
  }

  /**
   * Add new expense to array of expenses
   */
  _addExpense(): void {
    this._expenses.push({ name: this._expenseName, cost: this._expenseCost });

    this._expenseName = null;
    this._expenseCost = null;
  }

  /**
   * Remove expense clicked in proposal page
   * @param {ProposalExpense} expense
   */
  _removeExpense(expense: ProposalExpense): void {
    this._expenses = this._expenses.filter((element: ProposalExpense) => {
      return element.name != expense.name;
    });
  }

  /**
   * Modify map height depending on curret height (every time size changes)
   * @param sizeEvent
   */
  _onMapResized(sizeEvent: ResizedEvent): void {
    this._mapHeight = sizeEvent.newHeight - 32;
  }

  /**
   * Create marker on map displaying place of proposal project
   * @param {ProposalMapClick} clickEvent
   */
  _onMapClick(clickEvent: google.maps.PolyMouseEvent): void {
    this._mapMarker = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };
  }
}
