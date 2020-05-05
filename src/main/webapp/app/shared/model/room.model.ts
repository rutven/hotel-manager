import { IReservation } from 'app/shared/model/reservation.model';
import { RoomType } from 'app/shared/model/enumerations/room-type.model';

export interface IRoom {
  id?: number;
  roomNumber?: number;
  roomType?: RoomType;
  floor?: number;
  reservation?: IReservation;
}

export class Room implements IRoom {
  constructor(
    public id?: number,
    public roomNumber?: number,
    public roomType?: RoomType,
    public floor?: number,
    public reservation?: IReservation
  ) {}
}
