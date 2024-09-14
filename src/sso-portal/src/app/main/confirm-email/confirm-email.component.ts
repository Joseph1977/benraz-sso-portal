import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@josephbenraz/npm-common';
import { ConfirmEmail } from '../../shared/shared.model';
import { FragmentService } from '../../shared/fragment.service';
import { InternalLoginService } from '../internal-login.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmEmailComponent implements OnInit {

  isLoading = false;
  emailConfirmed = false;

  constructor(
    private router: Router,
    private internalLoginService: InternalLoginService,
    private fragmentService: FragmentService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    const fragment = this.fragmentService.getFragment();

    const model = {
      userId: fragment.userId,
      token: fragment.code
    } as ConfirmEmail;

    this.isLoading = true;
    this.internalLoginService
      .confirmEmail(model)
      .subscribe(
        () => this.emailConfirmed = true,
        error => this.notificationService.error(error)
      )
      .add(() => {
        this.isLoading = false;
      });
  }

  onLogin() {
    this.router.navigate(['/']);
  }
}
