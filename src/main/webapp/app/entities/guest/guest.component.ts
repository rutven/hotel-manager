import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGuest } from 'app/shared/model/guest.model';
import { AccountService } from 'app/core';
import { GuestService } from './guest.service';

@Component({
  selector: 'jhi-guest',
  templateUrl: './guest.component.html'
})
export class GuestComponent implements OnInit, OnDestroy {
  guests: IGuest[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected guestService: GuestService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.guestService
      .query()
      .pipe(
        filter((res: HttpResponse<IGuest[]>) => res.ok),
        map((res: HttpResponse<IGuest[]>) => res.body)
      )
      .subscribe(
        (res: IGuest[]) => {
          this.guests = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInGuests();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IGuest) {
    return item.id;
  }

  registerChangeInGuests() {
    this.eventSubscriber = this.eventManager.subscribe('guestListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
