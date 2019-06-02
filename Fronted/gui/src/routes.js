import React from 'react';
import { Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

import LoginForm from './components/LoginForm';
import CustomLayout from './containers/Layout';

const BaseRouter = () => (
    <div>
        <Route exact path="/login" component={LoginForm}/>
        <PrivateRoute exact path="/" component={CustomLayout}/>
  </div>
);

export default BaseRouter;