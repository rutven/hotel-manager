import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Guest from './guest';
import GuestDetail from './guest-detail';
import GuestUpdate from './guest-update';
import GuestDeleteDialog from './guest-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={GuestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={GuestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={GuestDetail} />
      <ErrorBoundaryRoute path={match.url} component={Guest} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={GuestDeleteDialog} />
  </>
);

export default Routes;
