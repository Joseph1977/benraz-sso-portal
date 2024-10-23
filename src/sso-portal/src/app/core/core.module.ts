import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EnvironmentsService, EnvironmentsServiceConfig, BenrazNgxCommonModule } from '@josephbenraz/npm-common';
import { AuthInterceptorService, PolicyRegistration, BenrazNgxAuthorizationModule } from '@josephbenraz/npm-authorization';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { Claims, Policies } from '../shared/shared.model';

@NgModule({
    declarations: [],
    exports: [], 
    imports: [
        SharedModule,
        BenrazNgxCommonModule.forRoot({
            companySubdomain: 'benraz',
            apiBaseUrl: CoreModule.getApiBaseUrl(),
            authorizationUrl: CoreModule.getAuthorizationUrl()
        }),
        BenrazNgxAuthorizationModule.forRoot({
            applicationId: null,
            ssoProviderCode: null,
            loginUrl: null,
            returnUrl: null,
            policies: [
                PolicyRegistration.claimsPolicy(Policies.PROFILE_SET_PASSWORD, [Claims.PROFILE_SET_PASSWORD])
            ]
        })],
        providers: [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptorService,
                multi: true
            },
            provideHttpClient(withInterceptorsFromDi())
        ]
})
export class CoreModule {
    static companySubdomain = 'benraz';

    static getApiBaseUrl(): string {
        const environmentsService = new EnvironmentsService({ companySubdomain: this.companySubdomain } as EnvironmentsServiceConfig);
        const environmentName = environmentsService.getEnvironmentNameByHostname(window.location.hostname);

        switch (environmentName) {
            case 'qa':
                return environment.qa.apiBaseUrl;
            case 'sb':
                return environment.sb.apiBaseUrl;
            default:
                return environment.apiBaseUrl;
        }
    }

    static getAuthorizationUrl(): string {
        const environmentsService = new EnvironmentsService({ companySubdomain: this.companySubdomain } as EnvironmentsServiceConfig);
        const environmentName = environmentsService.getEnvironmentNameByHostname(window.location.hostname);

        switch (environmentName) {
            case 'qa':
                return environment.qa.authorization.endpoint;
            case 'sb':
                return environment.sb.authorization.endpoint;
            default:
                return environment.authorization.endpoint;
        }
    }
}

