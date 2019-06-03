import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

import LoginForm from './components/LoginForm';
import CustomLayout from './containers/Layout';
import CreateAdmin from './components/CreateAdmin';
import Home from './components/Home';

const BaseRouter = () => (
    <div>
      <Switch>
        <Route exact path="/login" component={LoginForm}/>
        <PrivateRoute path="/" component={Home} />
      </Switch>
  </div>
);

export default BaseRouter;