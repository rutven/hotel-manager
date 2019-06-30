import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IRoom, Room } from 'app/shared/model/room.model';
import { RoomService } from './room.service';
import { IReservation } from 'app/shared/model/reservation.model';
import { ReservationService } from 'app/entities/reservation';

@Component({
  selector: 'jhi-room-update',
  templateUrl: './room-update.component.html'
})
export class RoomUpdateComponent implements OnInit {
  isSaving: boolean;

  reservations: IReservation[];

  editForm = this.fb.group({
    id: [],
    roomNumber: [null, [Validators.required, Validators.min(1)]],
    roomType: [],
    floor: [null, [Validators.required, Validators.min(0)]]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected roomService: RoomService,
    protected reservationService: ReservationService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ room }) => {
      this.updateForm(room);
    });
    this.reservationService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IReservation[]>) => mayBeOk.ok),
        map((response: HttpResponse<IReservation[]>) => response.body)
      )
      .subscribe((res: IReservation[]) => (this.reservations = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(room: IRoom) {
    this.editForm.patchValue({
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floor: room.floor
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const room = this.createFromForm();
    if (room.id !== undefined) {
      this.subscribeToSaveResponse(this.roomService.update(room));
    } else {
      this.subscribeToSaveResponse(this.roomService.create(room));
    }
  }

  private createFromForm(): IRoom {
    return {
      ...new Room(),
      id: this.editForm.get(['id']).value,
      roomNumber: this.editForm.get(['roomNumber']).value,
      roomType: this.editForm.get(['roomType']).value,
      floor: this.editForm.get(['floor']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoom>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackReservationById(index: number, item: IReservation) {
    return item.id;
  }
}
