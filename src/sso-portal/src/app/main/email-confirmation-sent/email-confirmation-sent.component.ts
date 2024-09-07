import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@josephbenraz/ngx-common';
import { SendConfirmationEmail } from '../../shared/shared.model';
import { InternalLoginService } from '../internal-login.service';

@Component({
  selector: 'app-email-confirmation-sent',
  templateUrl: './email-confirmation-sent.component.html',
  styleUrls: ['./email-confirmation-sent.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmailConfirmationSentComponent implements OnInit {

  isLoading = false;
  userId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private internalLoginService: InternalLoginService) {
      this.userId = this.route.snapshot.params.userId;
  }

  ngOnInit() {
  }

  onResendEmail() {
    const model = {
      userId: this.userId,
    } as SendConfirmationEmail;

    this.isLoading = true;
    this.internalLoginService
      .sendConfirmationEmail(model)
      .subscribe(
        () => {},
        error => this.notificationService.error(error)
      )
      .add(() => this.isLoading = false);
  }

  onBack() {
    this.router.navigate(['/']);
  }
}
