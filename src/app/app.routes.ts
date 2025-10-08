import { Routes } from '@angular/router';
import { AuthComponent } from './auth-component/auth-component';
import { WelcomePage } from './welcome-page/welcome-page';
import { Admin } from './home/admin/admin';
import { User } from './home/user/user';
import { View } from './view/view';
import { EditTask } from './edit-task/edit-task';
import { AboutPage } from './home/about-page/about-page';
import { AuthGuard } from './auth-gaurd-guard';
import { UserDetails } from './user-details/user-details';
import { PasswordResetComponent } from './passwordReset/password-reset-component/password-reset-component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: User,
    canActivate: [AuthGuard],
  },
  {
    path: 'view/:id',
    component: View,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:id',
    component: EditTask,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'detailsUser/:id',
    component: UserDetails,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    component: PasswordResetComponent,
    canActivate: [AuthGuard],
  },
];
