import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './room.reducer';
import { IRoom } from 'app/shared/model/room.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRoomDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class RoomDetail extends React.Component<IRoomDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { roomEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="mainApp.room.detail.title">Room</Translate> [<b>{roomEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="roomNumber">
                <Translate contentKey="mainApp.room.roomNumber">Room Number</Translate>
              </span>
            </dt>
            <dd>{roomEntity.roomNumber}</dd>
            <dt>
              <span id="roomType">
                <Translate contentKey="mainApp.room.roomType">Room Type</Translate>
              </span>
            </dt>
            <dd>{roomEntity.roomType}</dd>
            <dt>
              <span id="floor">
                <Translate contentKey="mainApp.room.floor">Floor</Translate>
              </span>
            </dt>
            <dd>{roomEntity.floor}</dd>
          </dl>
          <Button tag={Link} to="/entity/room" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/room/${roomEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ room }: IRootState) => ({
  roomEntity: room.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomDetail);