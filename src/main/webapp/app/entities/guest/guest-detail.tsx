import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './guest.reducer';
import { IGuest } from 'app/shared/model/guest.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IGuestDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class GuestDetail extends React.Component<IGuestDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { guestEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="mainApp.guest.detail.title">Guest</Translate> [<b>{guestEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="mainApp.guest.name">Name</Translate>
              </span>
            </dt>
            <dd>{guestEntity.name}</dd>
            <dt>
              <span id="phone">
                <Translate contentKey="mainApp.guest.phone">Phone</Translate>
              </span>
            </dt>
            <dd>{guestEntity.phone}</dd>
            <dt>
              <span id="email">
                <Translate contentKey="mainApp.guest.email">Email</Translate>
              </span>
            </dt>
            <dd>{guestEntity.email}</dd>
          </dl>
          <Button tag={Link} to="/entity/guest" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/guest/${guestEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ guest }: IRootState) => ({
  guestEntity: guest.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuestDetail);
