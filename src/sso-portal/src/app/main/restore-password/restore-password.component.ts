import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService, ValidationService } from '@josephbenraz/ngx-common';
import { CreateMfaModel, MfaCode, MfaData, MfaMode } from '../../shared/shared.model';
import { InternalLoginService } from '../internal-login.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit, OnDestroy {
  mfaData: MfaData;
  isLoading = false;
  isMfaCodePage: boolean = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private internalLoginService: InternalLoginService,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private route: ActivatedRoute) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.form.patchValue({ username: params['username']});
    });
  }

  ngOnDestroy() {
    this.isLoading = false;
  }

  restorePassword() {
    this.validationService.validate(this.form);
    if (this.form.invalid) {
      this.notificationService.error('Form is not valid');
      return;
    }

    const restorePassword = {
      userEmail: this.form.get('username').value,
      actionType: MfaCode.resetPassword,
      mode: MfaMode.email
    } as CreateMfaModel;

    this.isLoading = true;
    this.internalLoginService
      .createMfa(restorePassword)
      .subscribe(
        (data) => {
          this.mfaData = data;
        },
        error => {
          this.notificationService.error(error);
          this.isMfaCodePage = false;
        },
        () => {
          this.isMfaCodePage = true;
        }
      )
      .add(() => this.isLoading = false);
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onBackToRestore(){
    this.isMfaCodePage = false;
  }
}
