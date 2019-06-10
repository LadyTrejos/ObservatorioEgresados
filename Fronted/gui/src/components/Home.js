import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { Spin } from 'antd';

import ModAdmin from './ModAdmin';
import CreateAdmin from './CreateAdmin';
import AdminListView from '../containers/AdminListView';
import AdminLayout from '../containers/AdminLayout';
import SuperuserLayout from '../containers/SuperuserLayout';
import EventListView from '../containers/EvenListView'
import CreateEvent from './CreateEvent';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }
    
    componentDidMount(){
        const userID = localStorage.getItem('user');
        console.log(userID)
        axios.get(`http://127.0.0.1:8000/api/users/${userID}`)
        .then(res => {
            this.setState({
                user: res.data
            })
        })
    }

    getRoutes = () => {
        if(this.state.user.is_superuser){
            return (
            <SuperuserLayout>
                <Route exact path="/editar-admin/:id/" component={ModAdmin} />
                <Route exact path="/crear-admin" component={CreateAdmin} />
                <Route exact path="/ver-admins" component={AdminListView} />
            </SuperuserLayout>)
        } else if (this.state.user.is_admin){
            return (
            <AdminLayout>
                <Route exact path="/crear-evento" component={CreateEvent} />
                <Route exact path="/eventos" component={EventListView} />
            </AdminLayout>)
        }
    }
    render() {
        let isLoading = this.state.user ? false : true;
        return(
            <div >
            {
                isLoading ? 
                    <Spin tip="Cargando..."/> 
                : 
                (
                    this.getRoutes()
                    
                )
            }
            </div>
        );
    }
}

export default Home;