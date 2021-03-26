import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  _currentSubject: string;

  constructor(private _router: Router, private _authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._authService.getUserState().pipe(
      map((e) => {
        if (e) return true;
        else {
          this._resolveCurrentSubject(state.url);
          this._router.navigate([this._currentSubject, 'login']);
          return false;
        }
      }),
      catchError(() => {
        this._resolveCurrentSubject(state.url);
        this._router.navigate([this._currentSubject, 'login']);
        return of(false);
      })
    );
  }

  private _resolveCurrentSubject(url: string): void {
    const match = url.split('/');
    this._currentSubject = match[1];
  }
}
