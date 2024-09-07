import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { MainRoutingModule } from './main-routing.module';
import { SetPasswordComponent } from './set-password/set-password.component';
import { InternalLoginService } from './internal-login.service';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EmailConfirmationSentComponent } from './email-confirmation-sent/email-confirmation-sent.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ConfirmRestorePasswordComponent } from './restore-password/confirm-restore-password/confirm-restore-password.component';
import { ConfirmCreateAccountComponent } from './create-account/confirm-create-account/confirm-create-account.component';

@NgModule({
    imports: [
        SharedModule,
        MainRoutingModule
    ],
    declarations: [
        LoginComponent,
        ChangePasswordComponent,
        SetPasswordComponent,
        RestorePasswordComponent,
        CreateAccountComponent,
        EmailConfirmationSentComponent,
        ConfirmEmailComponent,
        ConfirmRestorePasswordComponent,
        ConfirmCreateAccountComponent
    ],
    providers: [
        InternalLoginService
    ],
    exports: []
})
export class MainModule { }
