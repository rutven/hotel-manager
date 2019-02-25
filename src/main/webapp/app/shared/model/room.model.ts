import { IReservation } from 'app/shared/model//reservation.model';

export const enum RoomType {
  STANDARD = 'STANDARD',
  COMFORT = 'COMFORT',
  LUXE = 'LUXE'
}

export interface IRoom {
  id?: number;
  roomNumber?: number;
  roomType?: RoomType;
  floor?: number;
  reservation?: IReservation;
}

export const defaultValue: Readonly<IRoom> = {};
