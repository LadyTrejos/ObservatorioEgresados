import React from 'react';
import { Layout, Menu, Icon, Button, Avatar, Spin} from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import './Layout.css'
import * as actions from '../store/actions/auth';
import logo from '../static/img/logo.png'
import HOSTNAME from '../helpers/hostname';


const { Header, Content, Sider } = Layout;

class AdminLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            country: "",
            email: "",
            id: "",
            id_type: "",
            is_admin: true,
            is_graduated: false,
            is_superuser: false,
            last_name: "",
            name: "",
            region: ""
        };
      }

    componentDidMount() {
        const userID = localStorage.getItem('user');
        axios.get(`${HOSTNAME}/api/users/${userID}/`)
        .then(res => {
            this.setState({
                user: res.data,
                city: res.data.city,
                country: res.data.country,
                email: res.data.email,
                id: res.data.id,
                id_type: res.data.id_type,
                is_active: res.data.is_active,
                is_admin: res.data.is_admin,
                is_graduated: res.data.is_graduated,
                is_superuser: res.data.is_superuser,
                last_name: res.data.last_name,
                name: res.data.name,
                region: res.data.region
            })
        })
    }

    checkIsActive =async()=>{
        const userID = localStorage.getItem('user');
        let res = await axios.get(`${HOSTNAME}/api/users/${userID}/`)
            this.setState({
                is_active: res.data.is_active,
               
            })
    }

    render() {
        this.checkIsActive()
        if(this.state.is_active===false){
            this.props.logout()
        }
        // isLoading indica si aún no tiene un usuario en el estado
        let isLoading = this.state.user ? false : true;
            return(
                <div>
                    
                {
                    isLoading ?
                        <Spin tip="Cargando..."/>
                    :
                    (
                 
                <Layout style={{height:'100vh'}}>
                    <Sider
                        style={{backgroundColor: '#2F3E9E', textAlign:'center', flex:1,justifyContent:'flex-end', alignContent:'left'}}
                        breakpoint="lg"
                        collapsedWidth="0"
                        onBreakpoint={broken => {

                        }}
                        onCollapse={(collapsed, type) => {
                        }}
                        >


                        <h1 className='h1'>Menú</h1>
                        <Avatar type="user" size={80} icon='user' />
                        <h1 className='h14'>Administrador</h1>
                        <h1 className='h12'>{this.state.user.name.toUpperCase()}</h1>



                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']} style={{backgroundColor: '#2F3E9E', textAlign:'left'}}>
                            <Menu.Item key="1">
                                <Icon type="user-add" />
                                <span className="nav-text">
                                    Mi perfil
                                </span>
                                <Link to='/perfil'></Link>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="2">
                                <Icon type="calendar" />
                                <span className="nav-text">
                                    Eventos
                                </span>
                                <Link to='/eventos'></Link>
                            </Menu.Item>

                            <Menu.Item key="3">
                                <Icon type="team" />
                                <span className="nav-text">
                                    Egresados
                                </span>
                                <Link to='/ver-egresados'></Link>
                            </Menu.Item>
                            {  /*
                            <Menu.Item key="4">
                                <Icon type="bexll" />
                                <span className="nav-text">
                                    Solicitudes de registro
                                </span>
                                <Link to='/crear-admin'></Link>
                            </Menu.Item> */}
                        </Menu>

                        <Button
                            type="primary"
                            onClick={this.props.logout}
                            style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                            Cerrar sesión
                        </Button>

                    </Sider>
                    <Layout style={{backgroundColor:'#E5E9FF'}}>
                        <Header
                            style={{height: '10%',
                                    minHeight: 60,
                                    backgroundColor:'#8796F0',
                                    fontSize:'150%',
                                    display:'flex',
                                    textAlign: 'right',
                                    flexDirection:'row',
                                    alignContent:'flex-center',
                                    justifyContent:'flex-end'}}
                        >
                            <img src={logo} alt="Logo de la página" style={{width: 50, height: 50}}/>
                            <h1 style={{color:'#fff'}}><strong>Observatorio de egresados</strong></h1>

                        </Header>
                        <Content style={{ margin: '24px 0px 0', backgroundColor:'#E5E9FF'}}>
                            <div style={{ padding: 24, background: '#E5E9FF', minHeight: 360}}>
                                {this.props.children}
                            </div>
                        </Content>
                    </Layout>

            </Layout>)
            }
            </div>
        )

    }

}

const mapStateToProps = state => {
    return {
      loading: state.loading,
      error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
      logout: () => dispatch(actions.logout())
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminLayout));
