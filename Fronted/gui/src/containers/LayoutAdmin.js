import React from 'react';
import { Layout, Menu, Icon, Button,Avatar} from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import './Layout.css'
import * as actions from '../store/actions/auth';



const { Header, Content, Sider } = Layout;
var userName = 'administrador'

class CustomLayoutAdmin extends React.Component {

    render() {
            return(
                <div>
                {
                    isLoading ?
                        <Spin tip="Cargando..."/>
                    :
                    (
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
                        <Avatar type="user" size={80} icon='user' />
                        <h1 className='h12'>{this.state.user.name.toUpperCase() }</h1>



                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{backgroundColor: '#2F3E9E', textAlign:'center'}}>
                            <Menu.Divider />
                            <Menu.Item key="1">
                                <Icon type="eye" />
                                <span className="nav-text">
                                    <Link to='/ver-admins'>Ver eventos</Link>
                                </span>
                                <Link to='/ver-egresados'></Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Icon type="user-add" />
                                <span className="nav-text">
                                    <Link to='/crear-admin'>Crear evento</Link>
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
                    <Layout style={{backgroundColor:'#E5E9FF'}}>
                    <Header
                            style={{height: '10%',
                                    backgroundColor:'#8796F0',
                                    fontSize:'150%',
                                    display:'flex',
                                    flexDirection:'row',
                                    alignContent:'flex-center',
                                    justifyContent:'flex-end'}}
                        >
                            <img src={logo} alt="Logo de la página" style={{width: 50, height: 50}}/>
                            <h1 style={{color:'#fff'}}><strong>Observatorio de egresados</strong></h1>

                        </Header>
                        <Content style={{ margin: '24px 0px 0' }}>
                            <div style={{ padding: 24, background: '#fff', minHeight: 360}}>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SuperuserLayout));
