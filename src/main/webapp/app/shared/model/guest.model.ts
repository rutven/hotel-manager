import { IReservation } from 'app/shared/model/reservation.model';

export interface IGuest {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  reservations?: IReservation[];
}

export const defaultValue: Readonly<IGuest> = {};
