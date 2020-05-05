import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGuest } from 'app/shared/model/guest.model';
import { GuestService } from './guest.service';
import { GuestDeleteDialogComponent } from './guest-delete-dialog.component';

@Component({
  selector: 'jhi-guest',
  templateUrl: './guest.component.html'
})
export class GuestComponent implements OnInit, OnDestroy {
  guests?: IGuest[];
  eventSubscriber?: Subscription;

  constructor(protected guestService: GuestService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.guestService.query().subscribe((res: HttpResponse<IGuest[]>) => (this.guests = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInGuests();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IGuest): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInGuests(): void {
    this.eventSubscriber = this.eventManager.subscribe('guestListModification', () => this.loadAll());
  }

  delete(guest: IGuest): void {
    const modalRef = this.modalService.open(GuestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.guest = guest;
  }
}
