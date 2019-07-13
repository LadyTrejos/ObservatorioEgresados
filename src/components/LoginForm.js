import React from 'react';
import { Form, Icon, Input, Button, Spin, Avatar } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../store/actions/auth';

import '../App.css';
import './LoginForm.css';
import logo from '../static/img/logo.png'
import history from '../helpers/history';


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class LoginForm extends React.Component {
  state ={
    user:'',
    password:'',
  };

  handleSubmit = e => {
    
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onAuth(values.email, values.password)
      }
    });
  };
 
  render() {
    const { getFieldDecorator } = this.props.form;
    const stylesObj = {
      backgroundColor: '#2F3E9E'
      };
    
    
    return (
        
        <div>
            <div style={{color:'#fff', backgroundColor:'#8796F0', textAlign: 'left', fontSize:'200%', height:'20%', width:'100%'}}>
                <img src={logo} alt="Logo de la página" style={{width: 40, height: 40}}/>
                <strong>Observatorio de egresados</strong>
            </div>

            <div style={stylesObj} className="container">
            
            </div>
            <div className='Div2'>
                <h1 className='h1Q'>¿Aún no tienes una cuenta?</h1>
                <Button 
                  className='ButtonRegister'
                  onClick={() => history.push('/registro')}
                  >
                    <strong>Regístrate</strong> 
                </Button>
            </div>
            
            <div className='Div3' >
                <h1 className='h1IS'>Iniciar sesión</h1>
                <Avatar type="user" size={80} icon='user' style={{color:'black', backgroundColor:'#8F9AE0'}} />
                
                  
                {
                    this.props.loading ? 
                    
                    <Spin indicator={antIcon} />
                    
                    :
                    
                    <Form onSubmit={this.handleSubmit} className='Input1'>                    
                        <Form.Item >
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: 'Ingrese su correo electrónico' }],
                            })(
                                <Input 
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }}  />}
                                size="large"
                                placeholder="Correo electrónico"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Ingrese su contraseña' }],
                            })(
                                <Input.Password
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                size="large"
                                placeholder="Contraseña"
                                onChange={e => this.setState({password: e.target.value})}
                                />,
                            )}
                        </Form.Item>
                        <br/>
                        <Form.Item>
                          <Button type="primary" htmlType="submit" size='large'>
                              Iniciar
                          </Button>
                        </Form.Item>
                    </Form>
                }
            </div>
        </div>
        
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginForm);

const mapStateToProps = state => {
    return {
      loading: state.loading,
      error: state.error
    }
  }
  
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(actions.authLogin(email, password))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm));