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

export const defaultValue: Readonly<IReservation> = {};
