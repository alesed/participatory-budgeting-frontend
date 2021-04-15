import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { SideNavigationComponent } from './layout/side-navigation/side-navigation.component';
import { HomeComponent } from './pages/home/home.component';
import { ProposalComponent } from './pages/proposal/proposal.component';
import { VoteComponent } from './pages/vote/vote.component';
import { ResultComponent } from './pages/result/result.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { HistoryComponent } from './pages/history/history.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PageNotFoundComponent } from './helpers/page-not-found/page-not-found.component';
import { SubjectComponent } from './helpers/subject/subject.component';
import { AppStateService } from './services/app-state.service';
import { SubjectGateway } from './helpers/subject/gateways/subject-gateway';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ProposalConfirmationComponent } from './dialogs/proposal-confirmation/proposal-confirmation.component';
import { AgmCoreModule } from '@agm/core';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MatMenuModule } from '@angular/material/menu';
import { RecaptchaModule } from 'ng-recaptcha';
import { DetailComponent } from './dialogs/detail/detail.component';
import { HomeGateway } from './pages/home/gateways/home-gateway';
import { MatStepperModule } from '@angular/material/stepper';
import { ScheduleGateway } from './pages/schedule/gateways/schedule-gateway';
import { ContactGateway } from './pages/contact/gateways/contact-gateway';
import { ContactConfirmationComponent } from './dialogs/contact-confirmation/contact-confirmation.component';
import { ImageSizeWarningComponent } from './dialogs/image-size-warning/image-size-warning.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DecisionComponent } from './pages/admin/components/decision/decision.component';
import { ChangeScheduleComponent } from './pages/admin/components/change-schedule/change-schedule.component';
import { SettingsComponent } from './pages/admin/components/settings/settings.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { DetailGateway } from './dialogs/detail/gateways/detail-gateway';
import { DecisionGateway } from './pages/admin/components/decision/gateways/decision-gateway';
import { ScheduleDetailComponent } from './dialogs/schedule-detail/schedule-detail.component';
import { ScheduleDetailGateway } from './dialogs/schedule-detail/gateways/schedule-detail-gateway';
import { ChangeScheduleGateway } from './pages/admin/components/change-schedule/gateways/change-schedule-gateways';
import { ScheduleDeleteComponent } from './dialogs/schedule-delete/schedule-delete.component';
import { SettingsGateway } from './pages/admin/components/settings/gateways/settings-gateway';
import { PolygonComponent } from './pages/admin/components/polygon/polygon.component';
import { PolygonConfirmationComponent } from './dialogs/polygon-confirmation/polygon-confirmation.component';
import { PolygonGateway } from './pages/admin/components/polygon/gateways/polygon-gateway';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './pages/admin/components/users/users.component';
import { UsersCreateComponent } from './dialogs/users-create/users-create.component';
import { environment } from 'src/environments/environment';
import { UsersDisableComponent } from './dialogs/users-disable/users-disable.component';
import { VoteGateway } from './pages/vote/gateways/vote-gateway';
import { ResultGateway } from './pages/result/gateways/result-gateway';
import { SharedGateway } from './shared/gateways/shared-gateway';
import { HistoryGateway } from './pages/history/gateways/history-gateway';
import { ProposalGateway } from './pages/proposal/gateways/proposal-gateway';
import { ScheduleDeleteGateway } from './dialogs/schedule-delete/gateways/schedule-delete-gateway';
import { SettingsConfirmationComponent } from './dialogs/settings-confirmation/settings-confirmation.component';
import { SettingsConfirmationGateway } from './dialogs/settings-confirmation/gateways/settings-confirmation-gateway';
import { CommonModule, registerLocaleData } from '@angular/common';
import { SettingsPhotoConfirmationComponent } from './dialogs/settings-photo-confirmation/settings-photo-confirmation.component';
import { WindowService } from './services/window.service';
import { VoteProcessComponent } from './dialogs/vote-process/vote-process.component';
import { VoteProcessGateway } from './dialogs/vote-process/gateways/vote-process-gateway';

import localeCs from '@angular/common/locales/cs';
import { DetailExpenseComponent } from './dialogs/detail-expense/detail-expense.component';
import { ChangeProjectComponent } from './helpers/change-project/change-project.component';
import { ChangeProjectGateway } from './helpers/change-project/gateways/change-project-gateway';
import { ProcessingPersonalDataComponent } from './dialogs/processing-personal-data/processing-personal-data.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LandingGateway } from './pages/landing/gateways/landing-gateway';
import { LandingConfirmationComponent } from './dialogs/landing-confirmation/landing-confirmation.component';

registerLocaleData(localeCs);

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SideNavigationComponent,
    HomeComponent,
    ProposalComponent,
    VoteComponent,
    ResultComponent,
    ScheduleComponent,
    HistoryComponent,
    ContactComponent,
    PageNotFoundComponent,
    SubjectComponent,
    ProposalConfirmationComponent,
    DetailComponent,
    ContactConfirmationComponent,
    ImageSizeWarningComponent,
    AdminComponent,
    DecisionComponent,
    ChangeScheduleComponent,
    SettingsComponent,
    ScheduleDetailComponent,
    ScheduleDeleteComponent,
    PolygonComponent,
    PolygonConfirmationComponent,
    LoginComponent,
    UsersComponent,
    UsersCreateComponent,
    UsersDisableComponent,
    SettingsConfirmationComponent,
    SettingsPhotoConfirmationComponent,
    VoteProcessComponent,
    DetailExpenseComponent,
    ChangeProjectComponent,
    ProcessingPersonalDataComponent,
    LandingComponent,
    LandingConfirmationComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBbwSKYjaUWFVdg5rFw1u4jCFCtIswHcsQ',
      libraries: ['places', 'drawing', 'geometry'],
    }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    AngularResizedEventModule,
    MatMenuModule,
    RecaptchaModule,
    MatStepperModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
  ],
  providers: [
    HttpClientModule,
    AppStateService,
    SubjectGateway,
    HomeGateway,
    ScheduleGateway,
    ContactGateway,
    DetailGateway,
    DecisionGateway,
    ScheduleDetailGateway,
    ChangeScheduleGateway,
    ScheduleDeleteGateway,
    SettingsGateway,
    SettingsConfirmationGateway,
    PolygonGateway,
    VoteGateway,
    ResultGateway,
    HistoryGateway,
    ProposalGateway,
    VoteProcessGateway,
    SharedGateway,
    ChangeProjectGateway,
    LandingGateway,
    WindowService,
    { provide: LOCALE_ID, useValue: 'cs' },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ProposalConfirmationComponent,
    ContactConfirmationComponent,
    ImageSizeWarningComponent,
    ScheduleDetailComponent,
    ScheduleDeleteComponent,
    PolygonConfirmationComponent,
    UsersCreateComponent,
    UsersDisableComponent,
    SettingsConfirmationComponent,
    SettingsPhotoConfirmationComponent,
    VoteProcessComponent,
    DetailExpenseComponent,
    ProcessingPersonalDataComponent,
    LandingConfirmationComponent,
  ],
})
export class AppModule {}
