import React from 'react';
import CreateAdmin from './CreateAdmin';
import { Route } from 'react-router-dom';
import CustomLayout from '../containers/Layout';

class Home extends React.Component {
    render() {
        return(
            <div>
                <CustomLayout>
                    <Route exact path="/crear-admin" component={CreateAdmin} />
                </CustomLayout>
            </div>
        );
    }
}

export default Home;