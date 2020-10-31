import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IReservation, Reservation } from 'app/shared/model/reservation.model';
import { ReservationService } from './reservation.service';
import { IRoom } from 'app/shared/model/room.model';
import { RoomService } from 'app/entities/room/room.service';
import { IGuest } from 'app/shared/model/guest.model';
import { GuestService } from 'app/entities/guest/guest.service';

type SelectableEntity = IRoom | IGuest;

@Component({
  selector: 'jhi-reservation-update',
  templateUrl: './reservation-update.component.html',
})
export class ReservationUpdateComponent implements OnInit {
  isSaving = false;
  rooms: IRoom[] = [];
  guests: IGuest[] = [];
  startDateDp: any;

  editForm = this.fb.group({
    id: [],
    startDate: [],
    days: [null, [Validators.min(1)]],
    room: [],
    guest: [],
  });

  constructor(
    protected reservationService: ReservationService,
    protected roomService: RoomService,
    protected guestService: GuestService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      this.updateForm(reservation);

      this.roomService
        .query({ filter: 'reservation-is-null' })
        .pipe(
          map((res: HttpResponse<IRoom[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IRoom[]) => {
          if (!reservation.room || !reservation.room.id) {
            this.rooms = resBody;
          } else {
            this.roomService
              .find(reservation.room.id)
              .pipe(
                map((subRes: HttpResponse<IRoom>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IRoom[]) => (this.rooms = concatRes));
          }
        });

      this.guestService.query().subscribe((res: HttpResponse<IGuest[]>) => (this.guests = res.body || []));
    });
  }

  updateForm(reservation: IReservation): void {
    this.editForm.patchValue({
      id: reservation.id,
      startDate: reservation.startDate,
      days: reservation.days,
      room: reservation.room,
      guest: reservation.guest,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
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
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      days: this.editForm.get(['days'])!.value,
      room: this.editForm.get(['room'])!.value,
      guest: this.editForm.get(['guest'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
