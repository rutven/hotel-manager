import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MainAppTestModule } from '../../../test.module';
import { GuestComponent } from 'app/entities/guest/guest.component';
import { GuestService } from 'app/entities/guest/guest.service';
import { Guest } from 'app/shared/model/guest.model';

describe('Component Tests', () => {
  describe('Guest Management Component', () => {
    let comp: GuestComponent;
    let fixture: ComponentFixture<GuestComponent>;
    let service: GuestService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MainAppTestModule],
        declarations: [GuestComponent]
      })
        .overrideTemplate(GuestComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GuestComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GuestService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Guest(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.guests && comp.guests[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
