import React from 'react';
import CreateAdmin from './CreateAdmin';
import { Route } from 'react-router-dom';
import CustomLayout from '../containers/Layout';
import ModAdmin from './ModAdmin';
import AdminList from './AdminList';
import AdminListView from '../containers/AdminListView';
import CreateEvento from './CreateEvento';

class Home extends React.Component {
<<<<<<< Updated upstream
=======
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
                <Route exact path="/ver-evento" component={EventListView} />
            </AdminLayout>)
        }
    }
>>>>>>> Stashed changes
    render() {
        return(
            <div>
<<<<<<< Updated upstream
                <CustomLayout>
                    <Route exact path="/modificar-admin" component={ModAdmin} />
                    <Route exact path="/crear-admin" component={CreateAdmin} />
                    <Route exact path="/createEvento" component={CreateEvento} />
                </CustomLayout>
=======
            {
                isLoading ?
                    <Spin tip="Cargando..."/>
                :
                (
                    this.getRoutes()

                )
            }
>>>>>>> Stashed changes
            </div>
        );
    }
}

export default Home;
