import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MainAppSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [MainAppSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [MainAppSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainAppSharedModule {
  static forRoot() {
    return {
      ngModule: MainAppSharedModule
    };
  }
}
