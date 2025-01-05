import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { BenrazNgxCommonModule } from '@josephbenraz/npm-common';
import { BenrazNgxAuthorizationModule } from '@josephbenraz/npm-authorization';

import { SharedMaterialModule } from './shared-material.module';
import { LayoutComponent } from './layout/layout.component';
import { StateService } from './state/state.service';
import { SsoProvidersService } from './sso-providers/sso-providers.service';
import { UserService } from './user.service';
import { FragmentService } from './fragment.service';
import { LoaderComponent } from './loader/loader.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CodeCheckComponent } from './code-check/code-check.component';
import { CountDownComponent } from './count-down/count-down.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ClipboardModule,
        NgScrollbarModule,
        SharedMaterialModule,
        BenrazNgxCommonModule,
        BenrazNgxAuthorizationModule,
        NgxMaskDirective, 
	    NgxMaskPipe
    ],
    declarations: [
        LoaderComponent,
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        CodeCheckComponent,
        CountDownComponent
    ],
    providers: [
        provideNgxMask()
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ClipboardModule,
        NgScrollbarModule,
        SharedMaterialModule,
        BenrazNgxCommonModule,
        BenrazNgxAuthorizationModule,
        LoaderComponent,
        CodeCheckComponent,
        CountDownComponent,
	    NgxMaskDirective, 
	    NgxMaskPipe
    ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
        ngModule: SharedModule,
        providers: [
            DatePipe,
            UserService,
            StateService,
            SsoProvidersService,
            FragmentService
        ]
    };
}
}
