import React from 'react';
import { Form, Icon, Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../store/actions/auth';

import '../App.css';
import './LoginForm.css'

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class LoginForm extends React.Component {
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
        background: '#2F3E9E'
      };
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <p>{ this.props.error.message }</p>
      )
    }
    return (
        
        <div>
            <div style={stylesObj} className="container">
            
            </div>

            <div className='Div2'>
                <h1 className='h1Q'>¿Aún no tienes una cuenta?</h1>
                <Form.Item style={{left:'40%'}}>
                    <Button type="primary" htmlType="submit" className='Button2'>
                        Registrarse
                    </Button>
                            
                </Form.Item>

            </div>
            
            <div className='Div3' >
                <h1 className='h1IS'>Iniciar sesión</h1>
                <Icon className='Icon' type="user"></Icon> 
                
                { errorMessage }
                {
                    this.props.loading ? 
                    
                    <Spin indicator={antIcon} />
                    
                    :
                    
                    <Form onSubmit={this.handleSubmit} className='Input'>                    
                        <Form.Item >
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: 'Por favor ingrese su correo electrónico' }],
                            })(
                                <Input className='Input2'
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }}  />}
                                size="large"
                                placeholder="Correo electrónico"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Por favor ingrese su contraseña' }],
                            })(
                                <Input.Password
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                size="large"
                                placeholder="Contraseña"
                                />,
                            )}
                        </Form.Item>
                        
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='Button'>
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