import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRoom } from 'app/shared/model/room.model';
import { RoomService } from './room.service';

@Component({
  templateUrl: './room-delete-dialog.component.html',
})
export class RoomDeleteDialogComponent {
  room?: IRoom;

  constructor(protected roomService: RoomService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.roomService.delete(id).subscribe(() => {
      this.eventManager.broadcast('roomListModification');
      this.activeModal.close();
    });
  }
}
