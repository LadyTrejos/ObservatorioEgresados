import React from 'react';
import { Layout, Menu, Icon, Button, Avatar, Spin} from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import './Layout.css'
import * as actions from '../store/actions/auth';



const { Header, Content, Sider } = Layout;

class AdminLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    componentDidMount() {
        const userID = localStorage.getItem('user');
        axios.get(`http://127.0.0.1:8000/api/users/${userID}`)
        .then(res => {
            this.setState({
                user: res.data
            })
        })
    }

    render() {
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
                        <h1 className='h12'>{this.state.user.name.toUpperCase() }</h1>
                        

                        
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']} style={{backgroundColor: '#2F3E9E', textAlign:'left'}}>
                            <Menu.Item key="1">
                                <Icon type="user-add" />
                                <span className="nav-text">
                                    Mi perfil
                                </span>
                                <Link to='/crear-admin'></Link>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="2">
                                <Icon type="calendar" />
                                <span className="nav-text">
                                    Eventos
                                </span>
                                <Link to='/crear-evento'></Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Icon type="team" />
                                <span className="nav-text">
                                    Egresados
                                </span>
                                <Link to='/crear-admin'></Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Icon type="bell" />
                                <span className="nav-text">
                                    Solicitudes de registro
                                </span>
                                <Link to='/crear-admin'></Link>
                            </Menu.Item>
                        </Menu>
                        
                        <Button 
                            type="primary" 
                            onClick={this.props.logout} 
                            style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                            Cerrar sesión
                        </Button>
                            
                    </Sider>
                    <Layout style={{backgroundColor:'#E5E9FF'}}>
                        <Header style={{height: '10%', backgroundColor:'#8796F0', textAlign: 'right', fontSize:'150%'}}>
                            <h1 >Observatorio de egresados</h1>
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