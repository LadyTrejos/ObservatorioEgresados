import React from 'react';
import { Form, Icon, Input, Button, notification} from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../store/actions/auth';

import '../App.css';
import './ForgotPassword.css';
import logo from '../static/img/logo.png'
import history from '../helpers/history';
import axios from 'axios';
import HOSTNAME from '../helpers/hostname';


class ForgotPasswordForm extends React.Component {

  handleSubmit = e => {
    
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        axios.post(`${HOSTNAME}/rest-auth/password/reset/`, JSON.stringify(values), 
            {headers: {"Content-type": "application/json"}})
        .then( res => {
            this.props.form.resetFields();
            notification.info({
                message: 'Las instrucciones se han enviado',
                description: 'Revise su correo electrónico y siga las instrucciones para restablecer su contraseña. Si no recibe el correo, asegúrese de que el correo ingresado es correcto y se encuentra registrado en nuestra página.',
                duration: 0
            })
            history.push('/login')
        })
        .catch(err => console.log(err.message))
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
            <div style={{color:'#fff', backgroundColor:'#8796F0', textAlign: 'left', fontSize:'200%', height:'20%', width:'100vw'}}>
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
                <h1 className='h1RC'>Recuperar contraseña</h1>
                <p >Ingresa el correo electrónico que tienes registrado en nuestra página y te enviaremos las instrucciones para recuperar el acceso a tu cuenta.</p>
                <br/>
                <div>
                    <Form onSubmit={this.handleSubmit} >                    
                        <Form.Item label="Correo electrónico: ">
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: 'Ingrese su correo electrónico' }],
                            })(
                                <Input 
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }}  />}
                                size="large"
                                style={{width:'80%'}}
                                placeholder="Correo electrónico"
                                />,
                            )}
                        </Form.Item>
                        
                        
                        <Form.Item>
                          <Button type="primary" htmlType="submit" size='large'>
                              Enviar
                          </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
        
    );
  }
}

const ForgotPassword = Form.create({ name: 'forgot_password_form' })(ForgotPasswordForm);

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword));