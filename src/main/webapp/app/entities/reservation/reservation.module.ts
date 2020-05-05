import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MainAppSharedModule } from 'app/shared';
import {
  ReservationComponent,
  ReservationDetailComponent,
  ReservationUpdateComponent,
  ReservationDeletePopupComponent,
  ReservationDeleteDialogComponent,
  reservationRoute,
  reservationPopupRoute
} from './';

const ENTITY_STATES = [...reservationRoute, ...reservationPopupRoute];

@NgModule({
  imports: [MainAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ReservationComponent,
    ReservationDetailComponent,
    ReservationUpdateComponent,
    ReservationDeleteDialogComponent,
    ReservationDeletePopupComponent
  ],
  entryComponents: [ReservationComponent, ReservationUpdateComponent, ReservationDeleteDialogComponent, ReservationDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainAppReservationModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
