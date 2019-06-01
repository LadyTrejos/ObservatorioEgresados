import React from 'react';
import { Route } from 'react-router-dom';

import LoginForm from './components/LoginForm';

const BaseRouter = () => (
    <div>
        <Route exact path='/login/' component={LoginForm} />
    </div>
);

export default BaseRouter;