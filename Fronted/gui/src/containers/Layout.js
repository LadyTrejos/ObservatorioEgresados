import React from 'react';
import { Layout, Menu, Icon, Button} from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './Layout.css'
import * as actions from '../store/actions/auth';


const { Header, Content, Sider } = Layout;
var userName = 'ivan'

class CustomLayout extends React.Component {

    render() {
            return(        
                <Layout style={{height:'100vh'}}>
                    <Sider
                        style={{backgroundColor: '#2F3E9E', textAlign:'center', flex:1,justifyContent:'flex-end', alignContent:'center'}}
                        breakpoint="lg"
                        collapsedWidth="0"
                        onBreakpoint={broken => {
                            console.log(broken);
                        }}
                        onCollapse={(collapsed, type) => {
                            console.log(collapsed, type);
                        }}
                        >
                    
                        
                        <h1 className='h1'>Menú</h1>
                        <Icon type="user" className='icon'/>
                        <h1 className='h12'>{userName}</h1>
                        

                        
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']} style={{backgroundColor: '#2F3E9E', textAlign:'center'}}>
                            <Menu.Item className='h13 '>Mi perfil</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="1">
                                <Icon type="eye" />
                                <span className="nav-text">Ver administradores</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="user-add" />
                                <span className="nav-text">Crear administradores</span>
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
                            <div style={{ padding: 24, background: '#fff', minHeight: 360, height: '100%' }}>
                                content
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