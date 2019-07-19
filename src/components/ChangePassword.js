import React from 'react';
import axios from 'axios';

import {
  Form,
  Input,
  Icon,
  Tooltip,
  Button,
  Modal,
  message
} from 'antd';
import HOSTNAME from '../helpers/hostname';


class PasswordChangeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      confirmDirty: false
    }
  }

  handleChangePassword = e => {
    console.log(this.props.state)
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userData = JSON.stringify(values);
        const token = localStorage.getItem('token');
        axios.post(`${HOSTNAME}/rest-auth/password/change/`, 
          userData, 
          { headers: {"Content-type": "application/json", "Authorization": `Token ${token}`}})
        .then(res => {
          message.success('La contraseña se ha cambiado correctamente.')
          this.setState({
            visiblePassword: false,
          });
        })
        .catch(err => 
            console.log(err)
          )
      }
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visiblePassword: false,
    });
  };
  
  showModalPassword = () => {
    this.setState({
      visiblePassword: true,
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new_password1')) {
      callback('Las contraseñas no son iguales.');
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

  validatePasswordFormat = (rule, value, callback) => {
    const regex = /^(?=.*[0-9])(?=.*[!-@_#$%^&*?"])[a-zA-Z0-9!-@_#$%^&*?"]{8,15}$/gi
    if(value.length > 15){
      callback("La contraseña es demasiado larga, use menos de 15 caracteres.")
    } else if (value.length > 0 && value.length < 8) {
      callback("La contraseña es muy corta, use al menos 8 caracteres.")
    } else if (value && !regex.test(value)) {
      callback("Elija una contraseña más segura. Pruebe con una combinación de letras números y símbolos")
    }
    callback();
  };

   render(){
        
      const {getFieldDecorator} = this.props.form;
       return(
            <Form.Item>
              <Button onClick={this.showModalPassword} size='large' type="primary"  
                style={{backgroundColor:'#8F9AE0', 
                borderColor:'#8F9AE0'}}
              >
                  Cambiar contraseña
              </Button>
              <Modal
                  onCancel={this.handleCancel}
                  title="Cambiar contraseña"
                  visible={this.state.visiblePassword}
                  footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      Cancelar
                    </Button>,
                    <Button key="save" onClick={this.handleChangePassword}>
                      Guardar
                  </Button>
                  ]}
                >
                    <Form.Item label="Contraseña actual">
                        {getFieldDecorator('old_password',
                         {rules: [{ required:true, message: 'Debe ingresar su contraseña actual' }]}
                        )(<Input.Password
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder='Contraseña actual'
                            size='large'
                            style={{backgroundColor:'#e5e9ff', borderColor:'#e5e9ff',borderRadius:10, width:'70%' }}
                          />)}
                    </Form.Item>

                    <Form.Item label={<span>
                          Nueva contraseña&nbsp;
                          
                          <Tooltip title="Utilice 8 caracteres como mínimo y 15 como máximo, con una combinación de letras números y símbolos como !@#$%^&*">
                            <Icon type="question-circle-o" />
                          </Tooltip>

                        </span>}
                        hasFeedback
                        >
                        {getFieldDecorator('new_password1', {
                                rules: [{ required: true, message: 'Ingrese su contraseña nueva' },
                                {
                                  validator: this.validateToNextPassword,
                                },
                                { validator: this.validatePasswordFormat}
                              ],
                            }
                        )(<Input.Password 
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder='Nueva contraseña'
                            size='large'
                            style={{backgroundColor:'#e5e9ff', borderColor:'#e5e9ff',borderRadius:10,width:'70%'}}
                          />)}
                    </Form.Item>

                    <Form.Item label="Confirmar nueva contraseña" hasFeedback>
                      {getFieldDecorator('new_password2', {
                        rules: [
                        {
                            required: true,
                            message: 'Confirme su contraseña nueva',
                        },
                        {
                            validator: this.compareToFirstPassword,
                        },
                        ],
                        })(
                          <Input.Password
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            size="large"
                            placeholder="Confirmar nueva contraseña"
                            style={{backgroundColor:'#e5e9ff', borderColor:'#e5e9ff',borderRadius:10,width:'70%'}}
                            onBlur={this.handleConfirmBlur}
                            />
                    )}
                          
                    </Form.Item>
              </Modal>
            </Form.Item>
       )
   }

  }
  
  const ChangePassword = Form.create({ name: 'change_password' })(PasswordChangeForm);


  export default ChangePassword;


