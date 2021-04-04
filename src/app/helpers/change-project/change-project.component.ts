import { Component, OnInit } from '@angular/core';

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

  constructor() {
    // empty
  }

  ngOnInit(): void {
    // TODO: real change of project data
    setTimeout(() => {
      const randomDecision = Math.floor(Math.random() * 10);
      console.log(randomDecision);

      this._loading = false;

      if (randomDecision <= 8) {
        this._resultMessage = CHANGE_SUCCESS;
      } else {
        this._resultMessage = CHANGE_ERROR;
      }
    }, 1000);
  }
}
