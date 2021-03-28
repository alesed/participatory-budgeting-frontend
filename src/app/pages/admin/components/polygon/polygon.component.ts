import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PolygonConfirmationComponent } from 'src/app/dialogs/polygon-confirmation/polygon-confirmation.component';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { PolygonGateway } from './gateways/polygon-gateway';
import {
  PolygonCoord,
  PolygonCoordsData,
  PolygonResponse,
} from './types/polygon.types';

const POLYGON_SUCCESS = 'Vymezení oblasti proběhlo úspěšně!';
const POLYGON_ERROR = 'Při vymezování oblasti došlo k chybě!';

@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent implements OnInit {
  _loading = false;

  _pointList: PolygonCoord[] = [];
  _drawingManager: google.maps.drawing.DrawingManager;
  _selectedShape: google.maps.Polygon;
  _selectedArea = 0;

  _mapLat = 49.194714576087954;
  _mapLng = 16.609002278955533;

  constructor(
    public _dialog: MatDialog,
    private _gateway: PolygonGateway,
    private _state: AppStateService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // empty
  }

  /**
   * Get current polygon of subject and set map with these data
   * @param {google.maps.Map<Element>} map
   */
  _onMapReady(map: google.maps.Map<Element>): void {
    this._gateway
      .getCurrentPolygon(this._state.subject.name)
      .subscribe((result: PolygonCoordsData) => {
        if (result && result.center) this._getCurrentPosition(result.center);
        this._initDrawingManager(map, result);
      });
  }

  private _getCurrentPosition(polygonCenter: PolygonCoord): void {
    this._mapLat = polygonCenter.lat;
    this._mapLng = polygonCenter.lng;
  }

  /**
   * Initialize drawing manager, place existing polygon, add event listeners for map
   * @param {google.maps.Map<Element>} map
   * @param {PolygonCoordsData} existingPolygon
   */
  private _initDrawingManager(
    map: google.maps.Map<Element>,
    existingPolygon?: PolygonCoordsData
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
        fillOpacity: 0.1,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };

    this._drawingManager = new google.maps.drawing.DrawingManager(options);
    this._drawingManager.setMap(map);

    // If polygon is retrieved from DB, display on map and disable drawing
    if (existingPolygon) {
      this._selectedShape = new google.maps.Polygon({
        paths: existingPolygon.coords,
      });
      this._selectedShape.setMap(map);

      self._drawingManager.setDrawingMode(null);
      // To hide:
      self._drawingManager.setOptions({
        drawingControl: false,
      });
    }

    // Map listen on different events and emit change
    google.maps.event.addListener(
      this._drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(paths.getAt(p), 'set_at', () => {
              if (!event.overlay.drag) {
                self.updatePointList(event.overlay.getPath());
              }
            });
            google.maps.event.addListener(paths.getAt(p), 'insert_at', () => {
              self.updatePointList(event.overlay.getPath());
            });
            google.maps.event.addListener(paths.getAt(p), 'remove_at', () => {
              self.updatePointList(event.overlay.getPath());
            });
          }
          self.updatePointList(event.overlay.getPath());
          this._selectedShape = event.overlay;
          this._selectedShape['type'] = event.type;
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          self._drawingManager.setDrawingMode(null);
          // To hide:
          self._drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );
  }

  /**
   * Does user really want to update new polygon dialog.
   */
  _confirmNewPolygon(): void {
    const confirmDialog = this._dialog.open(PolygonConfirmationComponent, {
      disableClose: true,
      data: this._selectedArea,
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this._loading = true;

        this._updatePolygon();
      }
    });
  }

  /**
   * Upload new polygon to DB
   */
  _updatePolygon(): void {
    const newCenter = this._getCenterOfNewPolygon();
    this._gateway
      .uploadNewPolygon(
        {
          center: newCenter,
          coords: this._pointList,
        },
        this._state.subject.name
      )
      .subscribe((result: PolygonResponse) => {
        if (result.success) {
          this._pointList = [];
          this._snackBar.open(POLYGON_SUCCESS, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        } else {
          this._snackBar.open(POLYGON_ERROR, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        }

        this._loading = false;
      });
  }

  /**
   * Calculate center of polygon
   * @returns {PolygonCoord}
   */
  private _getCenterOfNewPolygon(): PolygonCoord {
    const bounds = new google.maps.LatLngBounds();

    this._pointList.forEach((point) => {
      bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });

    return <PolygonCoord>{
      lat: bounds.getCenter().lat(),
      lng: bounds.getCenter().lng(),
    };
  }

  /**
   * Delete currently drawed polygon and enable drawing
   */
  deleteSelectedShape(): void {
    if (this._selectedShape) {
      this._selectedShape.setMap(null);
      this._selectedArea = 0;
      this._pointList = [];
      // To show:
      this._drawingManager.setOptions({
        drawingControl: true,
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
      });
    }
  }

  /**
   * Update polygon list of points from map element
   * @param {Object including coords} path
   */
  updatePointList(path: google.maps.MVCArray<google.maps.LatLng>): void {
    this._pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this._pointList.push(path.getAt(i).toJSON());
    }
    this._selectedArea = google.maps.geometry.spherical.computeArea(path);
  }
}
