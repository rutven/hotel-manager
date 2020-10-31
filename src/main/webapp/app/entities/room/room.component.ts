import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoom } from 'app/shared/model/room.model';
import { RoomService } from './room.service';
import { RoomDeleteDialogComponent } from './room-delete-dialog.component';

@Component({
  selector: 'jhi-room',
  templateUrl: './room.component.html',
})
export class RoomComponent implements OnInit, OnDestroy {
  rooms?: IRoom[];
  eventSubscriber?: Subscription;

  constructor(protected roomService: RoomService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.roomService.query().subscribe((res: HttpResponse<IRoom[]>) => (this.rooms = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInRooms();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IRoom): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInRooms(): void {
    this.eventSubscriber = this.eventManager.subscribe('roomListModification', () => this.loadAll());
  }

  delete(room: IRoom): void {
    const modalRef = this.modalService.open(RoomDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.room = room;
  }
}
