import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IRoom } from 'app/shared/model/room.model';
import { getEntities as getRooms } from 'app/entities/room/room.reducer';
import { IGuest } from 'app/shared/model/guest.model';
import { getEntities as getGuests } from 'app/entities/guest/guest.reducer';
import { getEntity, updateEntity, createEntity, reset } from './reservation.reducer';
import { IReservation } from 'app/shared/model/reservation.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IReservationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IReservationUpdateState {
  isNew: boolean;
  roomId: string;
  guestId: string;
}

export class ReservationUpdate extends React.Component<IReservationUpdateProps, IReservationUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '0',
      guestId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (!this.state.isNew) {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getRooms();
    this.props.getGuests();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { reservationEntity } = this.props;
      const entity = {
        ...reservationEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/reservation');
  };

  render() {
    const { reservationEntity, rooms, guests, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="mainApp.reservation.home.createOrEditLabel">
              <Translate contentKey="mainApp.reservation.home.createOrEditLabel">Create or edit a Reservation</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : reservationEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="reservation-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="reservation-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="startDateLabel" for="reservation-startDate">
                    <Translate contentKey="mainApp.reservation.startDate">Start Date</Translate>
                  </Label>
                  <AvField id="reservation-startDate" type="date" className="form-control" name="startDate" />
                </AvGroup>
                <AvGroup>
                  <Label id="daysLabel" for="reservation-days">
                    <Translate contentKey="mainApp.reservation.days">Days</Translate>
                  </Label>
                  <AvField
                    id="reservation-days"
                    type="string"
                    className="form-control"
                    name="days"
                    validate={{
                      min: { value: 1, errorMessage: translate('entity.validation.min', { min: 1 }) },
                      number: { value: true, errorMessage: translate('entity.validation.number') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="reservation-room">
                    <Translate contentKey="mainApp.reservation.room">Room</Translate>
                  </Label>
                  <AvInput id="reservation-room" type="select" className="form-control" name="room.id">
                    <option value="" key="0" />
                    {rooms
                      ? rooms.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="reservation-guest">
                    <Translate contentKey="mainApp.reservation.guest">Guest</Translate>
                  </Label>
                  <AvInput id="reservation-guest" type="select" className="form-control" name="guest.id">
                    <option value="" key="0" />
                    {guests
                      ? guests.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/reservation" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  rooms: storeState.room.entities,
  guests: storeState.guest.entities,
  reservationEntity: storeState.reservation.entity,
  loading: storeState.reservation.loading,
  updating: storeState.reservation.updating,
  updateSuccess: storeState.reservation.updateSuccess
});

const mapDispatchToProps = {
  getRooms,
  getGuests,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationUpdate);
