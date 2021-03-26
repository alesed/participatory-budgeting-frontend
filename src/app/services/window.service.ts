import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  constructor() {
    // empty
  }

  get windowRef(): Window {
    return window;
  }
}
