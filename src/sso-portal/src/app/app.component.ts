import { Component } from '@angular/core';
import { Router, NavigationEnd, UrlSerializer } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EnvironmentsService, EnvironmentsServiceConfig } from '@josephbenraz/npm-common';
import { environment } from 'src/environments/environment';

// adding Google analytics
declare var gtag

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    private router: Router,
    private urlSerializer: UrlSerializer) {
    const navEndEvent$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    );
    navEndEvent$.subscribe((e: NavigationEnd) => {
      const urlWithoutAccessToken = this.removeAccessToken(e.urlAfterRedirects);
      gtag('config', AppComponent.getGoogleAnalyticsId(), {
        'page_path': urlWithoutAccessToken
      });
    });
  }

  public removeAccessToken(url: string) {
    const urlTree = this.urlSerializer.parse(url);
    if (urlTree.queryParams['access_token']) {
      urlTree.queryParams['access_token'] = null;
    }
    if (urlTree.fragment && urlTree.fragment.includes('access_token')) {
      urlTree.fragment = null;
    }
    return this.urlSerializer.serialize(urlTree);
  }

  static getGoogleAnalyticsId(): string {
    const environmentsService = new EnvironmentsService({ companySubdomain: 'benraz' } as EnvironmentsServiceConfig);
    const environmentName = environmentsService.getEnvironmentNameByHostname(window.location.hostname);

    switch (environmentName) {
      case 'qa':
        return environment.qa.googleAnalyticsID;
      case 'sb':
        return environment.sb.googleAnalyticsID;
      default:
        return environment.googleAnalyticsID;
    }
  }
}
