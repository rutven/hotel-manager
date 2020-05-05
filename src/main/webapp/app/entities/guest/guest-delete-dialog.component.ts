import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGuest } from 'app/shared/model/guest.model';
import { GuestService } from './guest.service';

@Component({
  selector: 'jhi-guest-delete-dialog',
  templateUrl: './guest-delete-dialog.component.html'
})
export class GuestDeleteDialogComponent {
  guest: IGuest;

  constructor(protected guestService: GuestService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.guestService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'guestListModification',
        content: 'Deleted an guest'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-guest-delete-popup',
  template: ''
})
export class GuestDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ guest }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(GuestDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.guest = guest;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/guest', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/guest', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
