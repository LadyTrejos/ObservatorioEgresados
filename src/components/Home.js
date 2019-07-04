import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { Spin } from 'antd';

import ModAdmin from './ModAdmin';
import ModEgresado from './ModEgresado';
import CreateAdmin from './CreateAdmin';
import AdminListView from '../containers/AdminListView';
import EgresadoListView from '../containers/EgresadoListView';
import AdminLayout from '../containers/AdminLayout';
import SuperuserLayout from '../containers/SuperuserLayout';
import EventListView from '../containers/EvenListView'
import CreateEvent from './CreateEvent';
import ModAccountAdmin from './ModAccountAdmin';
import HOSTNAME from '../helpers/hostname';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    componentDidMount(){
        const userID = localStorage.getItem('user');
        console.log(userID)
        axios.get(`${HOSTNAME}/api/users/${userID}/`)
        .then(res => {
            this.setState({
                user: res.data
            })
        })
    }

    getRoutes = () => {
        if(this.state.user.is_superuser){
            console.log('es superusuario')
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
                  <Route exact path='/perfil' component={ModAccountAdmin}/>
                  <Route exact path="/ver-egresados" component={EgresadoListView} />
                  <Route exact path="/editar-egresado/:id/" component={ModEgresado}/>
              </AdminLayout>)
              }else if(this.state.user.is_graduated){
                return (
                    <AdminLayout>
                        <h1>Entró como egresado</h1>
                    </AdminLayout>)
              }
              }

    render() {
        let isLoading = this.state.user ? false : true;
        console.log('is loading: ', isLoading);
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
