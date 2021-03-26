import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth/guards/auth.guard';
import { PageNotFoundComponent } from './helpers/page-not-found/page-not-found.component';
import { SubjectComponent } from './helpers/subject/subject.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HistoryComponent } from './pages/history/history.component';
import { HomeComponent } from './pages/home/home.component';
import { ProposalComponent } from './pages/proposal/proposal.component';
import { ResultComponent } from './pages/result/result.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { VoteComponent } from './pages/vote/vote.component';

const routes: Routes = [
  { path: 'page-not-found', component: PageNotFoundComponent },
  {
    path: ':name',
    component: SubjectComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'proposal', component: ProposalComponent },
      { path: 'vote', component: VoteComponent },
      { path: 'result', component: ResultComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'history/:year', component: HistoryComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
