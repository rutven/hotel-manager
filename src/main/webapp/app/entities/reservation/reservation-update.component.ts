import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IReservation, Reservation } from 'app/shared/model/reservation.model';
import { ReservationService } from './reservation.service';
import { IRoom } from 'app/shared/model/room.model';
import { RoomService } from 'app/entities/room';
import { IGuest } from 'app/shared/model/guest.model';
import { GuestService } from 'app/entities/guest';

@Component({
  selector: 'jhi-reservation-update',
  templateUrl: './reservation-update.component.html'
})
export class ReservationUpdateComponent implements OnInit {
  isSaving: boolean;

  rooms: IRoom[];

  guests: IGuest[];
  startDateDp: any;

  editForm = this.fb.group({
    id: [],
    startDate: [],
    days: [null, [Validators.min(1)]],
    room: [],
    guest: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected reservationService: ReservationService,
    protected roomService: RoomService,
    protected guestService: GuestService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ reservation }) => {
      this.updateForm(reservation);
    });
    this.roomService
      .query({ filter: 'reservation-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IRoom[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRoom[]>) => response.body)
      )
      .subscribe(
        (res: IRoom[]) => {
          if (!this.editForm.get('room').value || !this.editForm.get('room').value.id) {
            this.rooms = res;
          } else {
            this.roomService
              .find(this.editForm.get('room').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IRoom>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IRoom>) => subResponse.body)
              )
              .subscribe(
                (subRes: IRoom) => (this.rooms = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.guestService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IGuest[]>) => mayBeOk.ok),
        map((response: HttpResponse<IGuest[]>) => response.body)
      )
      .subscribe((res: IGuest[]) => (this.guests = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(reservation: IReservation) {
    this.editForm.patchValue({
      id: reservation.id,
      startDate: reservation.startDate,
      days: reservation.days,
      room: reservation.room,
      guest: reservation.guest
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const reservation = this.createFromForm();
    if (reservation.id !== undefined) {
      this.subscribeToSaveResponse(this.reservationService.update(reservation));
    } else {
      this.subscribeToSaveResponse(this.reservationService.create(reservation));
    }
  }

  private createFromForm(): IReservation {
    return {
      ...new Reservation(),
      id: this.editForm.get(['id']).value,
      startDate: this.editForm.get(['startDate']).value,
      days: this.editForm.get(['days']).value,
      room: this.editForm.get(['room']).value,
      guest: this.editForm.get(['guest']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>) {
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

  trackRoomById(index: number, item: IRoom) {
    return item.id;
  }

  trackGuestById(index: number, item: IGuest) {
    return item.id;
  }
}
