import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './guest.reducer';
import { IGuest } from 'app/shared/model/guest.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IGuestProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Guest extends React.Component<IGuestProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { guestList, match } = this.props;
    return (
      <div>
        <h2 id="guest-heading">
          <Translate contentKey="mainApp.guest.home.title">Guests</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="mainApp.guest.home.createLabel">Create new Guest</Translate>
          </Link>
        </h2>
        <div className="table-responsive">
          {guestList && guestList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="mainApp.guest.name">Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="mainApp.guest.phone">Phone</Translate>
                  </th>
                  <th>
                    <Translate contentKey="mainApp.guest.email">Email</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {guestList.map((guest, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${guest.id}`} color="link" size="sm">
                        {guest.id}
                      </Button>
                    </td>
                    <td>{guest.name}</td>
                    <td>{guest.phone}</td>
                    <td>{guest.email}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${guest.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${guest.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${guest.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="mainApp.guest.home.notFound">No Guests found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ guest }: IRootState) => ({
  guestList: guest.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Guest);
