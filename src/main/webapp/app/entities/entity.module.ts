import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'room',
        loadChildren: () => import('./room/room.module').then(m => m.MainAppRoomModule)
      },
      {
        path: 'guest',
        loadChildren: () => import('./guest/guest.module').then(m => m.MainAppGuestModule)
      },
      {
        path: 'reservation',
        loadChildren: () => import('./reservation/reservation.module').then(m => m.MainAppReservationModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class MainAppEntityModule {}
