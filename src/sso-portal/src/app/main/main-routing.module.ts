import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EmailConfirmationSentComponent } from './email-confirmation-sent/email-confirmation-sent.component';
import { LoginComponent } from './login/login.component';
import { ConfirmRestorePasswordComponent } from './restore-password/confirm-restore-password/confirm-restore-password.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'set-password',
        component: SetPasswordComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'restore-password',
        component: RestorePasswordComponent
      },
      {
        path: 'create-account',
        component: CreateAccountComponent
      },
      {
        path: 'email-confirmation-sent/:userId',
        component: EmailConfirmationSentComponent
      },
      {
        path: 'confirm-email',
        component: ConfirmEmailComponent
      },
      {
        path: 'confirm-restore-password',
        component: ConfirmRestorePasswordComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
