import React from 'react';
import { Layout, Menu, Icon, Button,Avatar} from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import './Layout.css'
import * as actions from '../store/actions/auth';
import axios from 'axios'



const { Header, Content, Sider } = Layout;

class CustomLayout extends React.Component {

    state = {
        user:[],
    }

    componentDidMount(){
        {/*axios({
            method: "GET",
            url: 'http://127.0.0.1:8000/rest-auth/user',
            config: {
              headers: { Authorization: "Bearer "+ localStorage.getItem('token') }
            }
          })
        .then(res => {
            console.log("current-user:")
            console.log(res)
        }) */}
    }

    

    render() {
            return(
                <Layout style={{height:'100vh'}}>
                    <Sider
                        style={{backgroundColor: '#2F3E9E', textAlign:'center', flex:1,justifyContent:'flex-end', alignContent:'center'}}
                        breakpoint="lg"
                        collapsedWidth="0"
                        onBreakpoint={broken => {
                        }}
                        onCollapse={(collapsed, type) => {
                        }}
                        >
                    
                        
                        <h1 className='h1'>Menú</h1>
                        <Avatar type="user" size={80} icon='user' />
                        <h1 className='h12'>{this.props.user}</h1>
                        

                        
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']} style={{backgroundColor: '#2F3E9E', textAlign:'center'}}>
                            <Menu.Item className='h13 '>Mi perfil</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="1">
                                <Icon type="eye" />
                                <span className="nav-text">
                                    <Link to='/ver-admins'>Ver administradores</Link>
                                </span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="user-add" />
                                <span className="nav-text">
                                    <Link to='/crear-admin'>Crear administrador</Link>
                                </span>
                            </Menu.Item>
                            
                        </Menu>
                        
                        <Button 
                            type="primary" 
                            onClick={this.props.logout} 
                            style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                            Cerrar sesión
                        </Button>
                            
                    </Sider>
                    <Layout>
                        <Header style={{height: '10%', backgroundColor:'#fff', textAlign: 'right', fontSize:'150%'}}>
                            <h1>Observatorio de egresados</h1>
                        </Header>
                        <Content style={{ margin: '24px 0px 0' }}>
                            <div style={{ padding: 24, background: '#fff', minHeight: 360}}>
                                {this.props.children}
                            </div>
                        </Content>
                    </Layout>
                    
            </Layout>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomLayout));