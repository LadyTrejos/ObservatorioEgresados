import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Privacy from './components/Privacy';
import ResetPassword from './components/ResetPassword';

const BaseRouter = () => (
    <div>
      <Switch>
        <Route exact path="/login" component={LoginForm}/>
        <Route exact path="/registro" component={RegisterForm}/>
        <Route exact path="/privacy" component={Privacy}/>
        <Route exact path="/password-reset" component={ForgotPassword}/> 
        <Route exact path="/password-reset/confirm/:uid([0-9A-Za-z_\-]+)/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/" component={ResetPassword}/>
        <PrivateRoute path="/" component={Home}/>
      </Switch>
  </div>
);

export default BaseRouter;