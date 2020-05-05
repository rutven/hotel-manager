import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IRoom, Room } from 'app/shared/model/room.model';
import { RoomService } from './room.service';

@Component({
  selector: 'jhi-room-update',
  templateUrl: './room-update.component.html'
})
export class RoomUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    roomNumber: [null, [Validators.required, Validators.min(1)]],
    roomType: [],
    floor: [null, [Validators.required, Validators.min(0)]]
  });

  constructor(protected roomService: RoomService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ room }) => {
      this.updateForm(room);
    });
  }

  updateForm(room: IRoom): void {
    this.editForm.patchValue({
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floor: room.floor
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
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
      id: this.editForm.get(['id'])!.value,
      roomNumber: this.editForm.get(['roomNumber'])!.value,
      roomType: this.editForm.get(['roomType'])!.value,
      floor: this.editForm.get(['floor'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoom>>): void {
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
}
