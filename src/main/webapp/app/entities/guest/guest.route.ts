import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Guest } from 'app/shared/model/guest.model';
import { GuestService } from './guest.service';
import { GuestComponent } from './guest.component';
import { GuestDetailComponent } from './guest-detail.component';
import { GuestUpdateComponent } from './guest-update.component';
import { GuestDeletePopupComponent } from './guest-delete-dialog.component';
import { IGuest } from 'app/shared/model/guest.model';

@Injectable({ providedIn: 'root' })
export class GuestResolve implements Resolve<IGuest> {
  constructor(private service: GuestService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGuest> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Guest>) => response.ok),
        map((guest: HttpResponse<Guest>) => guest.body)
      );
    }
    return of(new Guest());
  }
}

export const guestRoute: Routes = [
  {
    path: '',
    component: GuestComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mainApp.guest.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: GuestDetailComponent,
    resolve: {
      guest: GuestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mainApp.guest.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: GuestUpdateComponent,
    resolve: {
      guest: GuestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mainApp.guest.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: GuestUpdateComponent,
    resolve: {
      guest: GuestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mainApp.guest.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const guestPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: GuestDeletePopupComponent,
    resolve: {
      guest: GuestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mainApp.guest.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
