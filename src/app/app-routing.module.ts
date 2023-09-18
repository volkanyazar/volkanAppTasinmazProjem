import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TasinmazComponent } from './tasinmaz/tasinmaz.component';
import { UsersComponent } from './users/users.component';
import { LogsComponent } from './logs/logs.component';
import { TasinmazAddComponent } from './tasinmaz/tasinmaz-add/tasinmaz-add.component';
import { TasinmazUpdateComponent } from './tasinmaz/tasinmaz-update/tasinmaz-update.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { UserUpdateComponent } from './users/user-update/user-update.component';
import { LogDetailComponent } from './logs/log-detail/log-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate:[AuthRedirectGuard]},
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'tasinmaz', component: TasinmazComponent },
      { path: 'kullanici-islemleri', component: UsersComponent, canActivate:[AdminGuard] },
      { path: 'tasinmaz/tasinmaz-add', component: TasinmazAddComponent },
      { path: 'tasinmaz/tasinmaz-update', component: TasinmazUpdateComponent },
      { path: 'kullanici-islemleri/user-add', component: UserAddComponent, canActivate:[AdminGuard] },
      { path: 'kullanici-islemleri/user-update', component: UserUpdateComponent, canActivate:[AdminGuard] },
      { path: 'log-islemleri/logdetails', component: LogDetailComponent, canActivate:[AdminGuard] },
      { path: 'log-islemleri', component: LogsComponent, canActivate:[AdminGuard] },
    ],
  },
  { path: 'err', component: NotFoundComponent },
  { path: '**', redirectTo: '/err' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
