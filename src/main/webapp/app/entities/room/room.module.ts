import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MainAppSharedModule } from 'app/shared';
import {
  RoomComponent,
  RoomDetailComponent,
  RoomUpdateComponent,
  RoomDeletePopupComponent,
  RoomDeleteDialogComponent,
  roomRoute,
  roomPopupRoute
} from './';

const ENTITY_STATES = [...roomRoute, ...roomPopupRoute];

@NgModule({
  imports: [MainAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [RoomComponent, RoomDetailComponent, RoomUpdateComponent, RoomDeleteDialogComponent, RoomDeletePopupComponent],
  entryComponents: [RoomComponent, RoomUpdateComponent, RoomDeleteDialogComponent, RoomDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainAppRoomModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
