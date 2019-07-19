import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { Spin } from 'antd';

import CreateAdmin from './CreateAdmin';
import CreateEvent from './CreateEvent';
import ModAccountAdmin from './ModAccountAdmin';
import ModAccountGraduated from './ModAccountGraduated';
import ModAdmin from './ModAdmin';
import ModEgresado from './ModEgresado';
import ModEvent from './ModEvent';

import AdminListView from '../containers/AdminListView';
import EgresadoListView from '../containers/EgresadoListView';
import EgresadoListView1 from '../containers/EgresadoListView1';
import EventListView from '../containers/EvenListView'
import EventListView1 from '../containers/EvenListView1'
import FriendRequestView from '../containers/FriendRequestView';

import AdminLayout from '../containers/AdminLayout';
import EgresadoLayout from '../containers/EgresadoLayout';
import SuperuserLayout from '../containers/SuperuserLayout';
import HOSTNAME from '../helpers/hostname';
import FriendCircleListView from '../containers/FriendCircleListView';
import EventDetail from './EventDetail';
import EventDetailGraduated from './EventDetailGraduated';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    componentDidMount(){
        const userID = localStorage.getItem('user');
        axios.get(`${HOSTNAME}/api/users/${userID}/`)
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
                <Route exact path="/crear-evento/" component={CreateEvent} />
                <Route exact path="/eventos/" component={EventListView} />
                <Route exact path='/perfil' component={ModAccountAdmin}/>
                <Route exact path='/editar-evento/:id/' component={ModEvent}/>
                <Route exact path="/ver-egresados" component={EgresadoListView} />
                <Route exact path="/editar-egresado/:id/" component={ModEgresado}/>
                <Route exact path="/evento/:id/" component={EventDetail}/>
              </AdminLayout>)
            }  else if (this.state.user.is_graduated ){
              return (
              <EgresadoLayout>
                <Route exact path="/perfil" component={ModAccountGraduated}/>
                <Route exact path="/ver-evento1" component={EventListView1} />
                <Route exact path="/ver-egresados1" component={EgresadoListView1} />
                <Route exact path="/eventos1" component={EventListView1} />
                <Route exact path="/solicitudes" component={FriendRequestView} />
                <Route exact path="/amigos" component={FriendCircleListView}/>
                <Route exact path="/evento/:id" component={EventDetailGraduated}/>
              </EgresadoLayout>)
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
