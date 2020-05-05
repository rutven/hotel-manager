import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MainAppSharedModule } from 'app/shared';
import {
  GuestComponent,
  GuestDetailComponent,
  GuestUpdateComponent,
  GuestDeletePopupComponent,
  GuestDeleteDialogComponent,
  guestRoute,
  guestPopupRoute
} from './';

const ENTITY_STATES = [...guestRoute, ...guestPopupRoute];

@NgModule({
  imports: [MainAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [GuestComponent, GuestDetailComponent, GuestUpdateComponent, GuestDeleteDialogComponent, GuestDeletePopupComponent],
  entryComponents: [GuestComponent, GuestUpdateComponent, GuestDeleteDialogComponent, GuestDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainAppGuestModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
