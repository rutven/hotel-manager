import { Moment } from 'moment';
import { IRoom } from 'app/shared/model/room.model';
import { IGuest } from 'app/shared/model/guest.model';

export interface IReservation {
  id?: number;
  startDate?: Moment;
  days?: number;
  room?: IRoom;
  guest?: IGuest;
}

export class Reservation implements IReservation {
  constructor(public id?: number, public startDate?: Moment, public days?: number, public room?: IRoom, public guest?: IGuest) {}
}
