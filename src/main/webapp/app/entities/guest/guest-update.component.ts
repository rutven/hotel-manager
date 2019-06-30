import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IGuest, Guest } from 'app/shared/model/guest.model';
import { GuestService } from './guest.service';

@Component({
  selector: 'jhi-guest-update',
  templateUrl: './guest-update.component.html'
})
export class GuestUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [],
    phone: [],
    email: []
  });

  constructor(protected guestService: GuestService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ guest }) => {
      this.updateForm(guest);
    });
  }

  updateForm(guest: IGuest) {
    this.editForm.patchValue({
      id: guest.id,
      name: guest.name,
      phone: guest.phone,
      email: guest.email
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const guest = this.createFromForm();
    if (guest.id !== undefined) {
      this.subscribeToSaveResponse(this.guestService.update(guest));
    } else {
      this.subscribeToSaveResponse(this.guestService.create(guest));
    }
  }

  private createFromForm(): IGuest {
    return {
      ...new Guest(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      phone: this.editForm.get(['phone']).value,
      email: this.editForm.get(['email']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGuest>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
