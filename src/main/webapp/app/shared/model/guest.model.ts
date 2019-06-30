import { IReservation } from 'app/shared/model/reservation.model';

export interface IGuest {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  reservations?: IReservation[];
}

export class Guest implements IGuest {
  constructor(
    public id?: number,
    public name?: string,
    public phone?: string,
    public email?: string,
    public reservations?: IReservation[]
  ) {}
}
