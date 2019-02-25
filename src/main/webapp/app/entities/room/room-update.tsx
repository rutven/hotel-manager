import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IReservation } from 'app/shared/model/reservation.model';
import { getEntities as getReservations } from 'app/entities/reservation/reservation.reducer';
import { getEntity, updateEntity, createEntity, reset } from './room.reducer';
import { IRoom } from 'app/shared/model/room.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IRoomUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IRoomUpdateState {
  isNew: boolean;
  reservationId: string;
}

export class RoomUpdate extends React.Component<IRoomUpdateProps, IRoomUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      reservationId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getReservations();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { roomEntity } = this.props;
      const entity = {
        ...roomEntity,
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
    this.props.history.push('/entity/room');
  };

  render() {
    const { roomEntity, reservations, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="mainApp.room.home.createOrEditLabel">
              <Translate contentKey="mainApp.room.home.createOrEditLabel">Create or edit a Room</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : roomEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="room-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="roomNumberLabel" for="roomNumber">
                    <Translate contentKey="mainApp.room.roomNumber">Room Number</Translate>
                  </Label>
                  <AvField
                    id="room-roomNumber"
                    type="string"
                    className="form-control"
                    name="roomNumber"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      min: { value: 1, errorMessage: translate('entity.validation.min', { min: 1 }) },
                      number: { value: true, errorMessage: translate('entity.validation.number') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="roomTypeLabel">
                    <Translate contentKey="mainApp.room.roomType">Room Type</Translate>
                  </Label>
                  <AvInput
                    id="room-roomType"
                    type="select"
                    className="form-control"
                    name="roomType"
                    value={(!isNew && roomEntity.roomType) || 'STANDARD'}
                  >
                    <option value="STANDARD">
                      <Translate contentKey="mainApp.RoomType.STANDARD" />
                    </option>
                    <option value="COMFORT">
                      <Translate contentKey="mainApp.RoomType.COMFORT" />
                    </option>
                    <option value="LUXE">
                      <Translate contentKey="mainApp.RoomType.LUXE" />
                    </option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="floorLabel" for="floor">
                    <Translate contentKey="mainApp.room.floor">Floor</Translate>
                  </Label>
                  <AvField
                    id="room-floor"
                    type="string"
                    className="form-control"
                    name="floor"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      min: { value: 0, errorMessage: translate('entity.validation.min', { min: 0 }) },
                      number: { value: true, errorMessage: translate('entity.validation.number') }
                    }}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/room" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp;
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
  reservations: storeState.reservation.entities,
  roomEntity: storeState.room.entity,
  loading: storeState.room.loading,
  updating: storeState.room.updating,
  updateSuccess: storeState.room.updateSuccess
});

const mapDispatchToProps = {
  getReservations,
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
)(RoomUpdate);
