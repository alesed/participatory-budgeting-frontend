import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserCreateData } from 'src/app/pages/admin/components/users/types/users.types';
import { environment } from 'src/environments/environment';
import { UserDetails } from './types/auth.types';

const LOGIN_ERROR = 'Učet neexistuje nebo byl zablokován!';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private eventAuthError = new BehaviorSubject<unknown>(null);
  eventAuthError$ = this.eventAuthError.asObservable();

  private _newUser: UserCreateData;

  constructor(
    private _fireAuth: AngularFireAuth,
    private _fireStore: AngularFirestore,
    private _router: Router,
    private _state: AppStateService
  ) {}

  getUserState(): Observable<firebase.User> {
    return this._fireAuth.authState;
  }

  /**
   * Check user isDisabled parameter and than do login
   * @param {string} email
   * @param {string} password
   */
  login(email: string, password: string): void {
    this._checkDisabledStatus(email).subscribe((users) => {
      if (users.empty) {
        this.eventAuthError.next({
          message: LOGIN_ERROR,
        });
      }

      users.forEach((user) => {
        const userData = user.data() as UserDetails;
        if (
          !userData.isDisabled &&
          userData.subject === this._state.subject.name
        ) {
          this._doLogin(email, password);
        } else {
          this.eventAuthError.next({
            message: LOGIN_ERROR,
          });
        }
      });
    });
  }

  loginPhone(
    phone: string,
    appVerifier: firebase.auth.ApplicationVerifier
  ): Promise<firebase.auth.ConfirmationResult> {
    return this._fireAuth.signInWithPhoneNumber(phone, appVerifier);
  }

  /**
   * Checks user disabled status from firebase authentication
   * @param {string} email
   * @returns {Observable<T>}
   */
  private _checkDisabledStatus(
    email: string
  ): Observable<firebase.firestore.QuerySnapshot<unknown>> {
    return this._fireStore
      .collection('Users', (ref) =>
        ref
          .where('subject', '==', this._state.subject.name)
          .where('email', '==', email)
      )
      .get({ source: 'server' });
  }

  /**
   * After successful login redirect to intern system otherwise throw error
   * @param {string} email
   * @param {string} password
   */
  private _doLogin(email: string, password: string): void {
    this._fireAuth
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        this._fireAuth
          .signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            if (userCredential) {
              this._router.navigate([this._state.subject.name, 'admin']);
            }
          })
          .catch((error) => {
            this.eventAuthError.next(error);
          });
      });
  }

  /**
   * Init temp app to disable logging in new user
   * set Metadata & displayName
   * @param {UserCreateData} user
   */
  createUser(user: UserCreateData): void {
    const tempApp = firebase.initializeApp(
      environment.firebaseConfig,
      'tempApp'
    );
    tempApp
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        this._newUser = user;

        userCredential.user.updateProfile({
          displayName: `${this._state.subject.name} | ${this._newUser.name} ${this._newUser.surname}`,
        });

        this._insertUserData(userCredential).then(() => {
          this._router.navigate([this._state.subject.name, 'admin']);
          tempApp
            .delete()
            .then(() =>
              this.getAllUsersExcludingOwner(this._state.subject.name)
            )
            .catch((error) => this.eventAuthError.next(error));
        });
      })
      .catch((error) => {
        this.eventAuthError.next(error);
      });
  }

  /**
   * Insert data of new user of administration console into Firebase storage
   * @param {firebase.auth.UserCredential} userCredential
   */
  private _insertUserData(
    userCredential: firebase.auth.UserCredential
  ): Promise<void> {
    return this._fireStore.doc(`/Users/${userCredential.user.uid}`).set({
      email: this._newUser.email,
      name: this._newUser.name,
      surname: this._newUser.surname,
      subject: this._state.subject.name,
      isOwner: false,
      isDisabled: false,
    });
  }

  /**
   * Change disabled status of provided user
   * @param {UserDetails} user
   */
  changeDisabledStatus(user: UserDetails): Promise<void> {
    return this._fireStore.doc(`/Users/${user.uid}`).set({
      email: user.email,
      name: user.name,
      surname: user.surname,
      subject: user.subject,
      isOwner: user.isOwner,
      isDisabled: !user.isDisabled,
    });
  }

  /**
   * Get user Metadata from firestore cloud
   * @param {string} uid
   * @returns {Observable<T>}
   */
  getUserMetadata(
    uid: string
  ): Observable<firebase.firestore.DocumentSnapshot<unknown>> {
    return this._fireStore
      .collection('Users')
      .doc(uid)
      .get({ source: 'server' });
  }

  /**
   * Query retrieving users from current subject (wihout isOwner flag)
   * @param {string} subjectName
   * @returns {Observable<T>}
   */
  getAllUsersExcludingOwner(
    subjectName: string
  ): Observable<firebase.firestore.QuerySnapshot<unknown>> {
    return this._fireStore
      .collection('Users', (ref) =>
        ref.where('subject', '==', subjectName).where('isOwner', '==', false)
      )
      .get({ source: 'server' });
  }

  /**
   * Logout user from current session
   */
  logout(): Promise<void> {
    console.log('procAUTH');
    return this._fireAuth.signOut().then(() => {
      this._router.navigate([this._state.subject.name, 'home']);
    });
  }

  /**
   * Send message to desired email with password reset
   * @param {string} email
   */
  forgottenPassword(email: string): Promise<void> {
    return this._fireAuth.sendPasswordResetEmail(email);
  }
}
