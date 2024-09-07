import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternalUrlsService } from '@josephbenraz/ngx-common';
import { SsoProvider } from './sso-providers.model';

@Injectable()
export class SsoProvidersService {
    constructor(private internalUrlsService: InternalUrlsService, private http: HttpClient) { }

    getServerSsoProviders(applicationId: string): Observable<SsoProvider[]> {
        return this.http.get<SsoProvider[]>(
            `${this.internalUrlsService.getApiBaseUrl()}/auth/applications/${applicationId}/sso-providers`);
    }
}
