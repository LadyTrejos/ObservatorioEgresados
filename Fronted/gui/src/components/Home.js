import React from 'react';
import CreateAdmin from './CreateAdmin';
import { Route } from 'react-router-dom';
import CustomLayout from '../containers/Layout';
import ModAdmin from './ModAdmin';
import AdminList from './AdminList';

class Home extends React.Component {
    render() {
        return(
            <div>
                <CustomLayout>
                    <Route exact path="/modificar-admin" component={ModAdmin} />
                    <Route exact path="/crear-admin" component={CreateAdmin} />
                    <Route exact path="/ver-admins" component={AdminList} />
                </CustomLayout>
            </div>
        );
    }
}

export default Home;