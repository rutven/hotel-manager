import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IRoom, Room } from 'app/shared/model/room.model';
import { RoomService } from './room.service';
import { RoomComponent } from './room.component';
import { RoomDetailComponent } from './room-detail.component';
import { RoomUpdateComponent } from './room-update.component';

@Injectable({ providedIn: 'root' })
export class RoomResolve implements Resolve<IRoom> {
  constructor(private service: RoomService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoom> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((room: HttpResponse<Room>) => {
          if (room.body) {
            return of(room.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Room());
  }
}

export const roomRoute: Routes = [
  {
    path: '',
    component: RoomComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mainApp.room.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: RoomDetailComponent,
    resolve: {
      room: RoomResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mainApp.room.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: RoomUpdateComponent,
    resolve: {
      room: RoomResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mainApp.room.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: RoomUpdateComponent,
    resolve: {
      room: RoomResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mainApp.room.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
