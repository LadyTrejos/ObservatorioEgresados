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


class ResetPasswordForm extends React.Component {
  state ={
    email:'',
  };

  handleSubmit = e => {
    
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newData = JSON.stringify({
            "new_password1": values.new_password1,
            "new_password2": values.new_password2,
            "uid": this.props.match.params.uid,
            "token": this.props.match.params.token
        })
        console.log(newData)
        axios.post(`${HOSTNAME}/rest-auth/password/reset/confirm/`, newData, 
            {headers: {"Content-type": "application/json"}})
        .then( res => {
            this.props.form.resetFields();
            notification.success({
                message: 'Contraseña restablecida',
                description: 'La contraseña se ha actualizado correctamente. Inicie sesión para ponerse al día con nuestros eventos.',
                duration: 0
            })
            history.push('/login')
        })
        .catch(err => console.log(err.message))
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new_password1')) {
      callback('Las contraseñas no coinciden.');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['new_password2'], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
                <br/>
                <div>
                    <Form onSubmit={this.handleSubmit} >                    
                        <Form.Item label="Nueva contraseña: " hasFeedback>
                            {getFieldDecorator('new_password1', {
                                rules: [{ required: true, message: 'Ingrese su nueva contraseña' },{
                                    validator: this.validateToNextPassword,
                                    },
                                  {pattern: /^(?=.*[0-9])(?=.*[!@_#$%^&*])[a-zA-Z0-9!@_#$%^&*]{8,15}$/, message:'Elija una contraseña más segura. Pruebe con una combinación de letras números y símbolos'} ],
                            })(
                                <Input.Password
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}  />}
                                size="large"
                                style={{width:'80%'}}
                                placeholder="Nueva contraseña"
                                />,
                            )}
                        </Form.Item>
                        
                        <Form.Item label="Confirmar la contraseña nueva: " hasFeedback>
                            {getFieldDecorator('new_password2', {
                                rules: [{ required: true, message: 'Confirme su contraseña nueva' },
                                {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input.Password 
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}  />}
                                size="large"
                                style={{width:'80%'}}
                                placeholder="Confirmación de contraseña nueva"
                                onBlur={this.handleConfirmBlur}
                                />,
                            )}
                        </Form.Item>
                        
                        <Form.Item>
                          <Button type="primary" htmlType="submit" size='large'>
                              Guardar
                          </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
        
    );
  }
}

const ResetPassword = Form.create({ name: 'reset_password_form' })(ResetPasswordForm);

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));