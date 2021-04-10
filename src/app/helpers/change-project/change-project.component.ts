import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeProjectGateway } from './gateways/change-project-gateway';
import { ChangeProjectResponse } from './types/change-project.types';

const CHANGE_SUCCESS = 'Projekt byl úspěšně změňen!';
const CHANGE_ERROR = 'Došlo k chybě při změně projektu, kontaktujte obec!';

@Component({
  selector: 'app-change-project',
  templateUrl: './change-project.component.html',
  styleUrls: ['./change-project.component.scss'],
})
export class ChangeProjectComponent implements OnInit {
  _loading = true;
  _resultMessage: string;

  _hash: string;
  _projectId: number;

  constructor(
    private _route: ActivatedRoute,
    private _gateway: ChangeProjectGateway
  ) {}

  ngOnInit(): void {
    const paramsURL = this._route.snapshot.params;

    this._hash = paramsURL.hash;
    this._projectId = +paramsURL.projectId;

    this._resolveProjectUpdate();
  }

  /**
   * Grab hash and projectId from URL params and resolve update of project
   */
  private _resolveProjectUpdate(): void {
    this._gateway
      .updateDesiredProject(this._hash, this._projectId)
      .subscribe((result: ChangeProjectResponse) => {
        if (result.success === true) {
          this._resultMessage = CHANGE_SUCCESS;
        } else {
          this._resultMessage = CHANGE_ERROR;
        }

        this._loading = false;
      });
  }
}
