import React from 'react';
import axios from 'axios';

import {
  Form,
  Input,
  Icon,
  Tooltip,
  Button,
  Modal,
} from 'antd';


  class PasswordChangeForm extends React.Component {
    constructor(props) {
      super(props);
      this.state={
          admins: []
      }
  }
  handleCancel = e => {
    console.log(e);
    this.setState({
      visiblePassword: false,
    });
  };

  handleCancelPassword = e => {
    console.log(e);
    this.setState({
      visiblePassword: false,
    });
  };

  changePassword = () => {
    this.setState({ userInfo: {
      ...this.state.userInfo, password: this.state.pass1
    }})
  }

  passwordConfirm = (rule,value,callback) => {
    
    if (value !== this.state.pass1){
        callback("Las contraseñas no coinciden")
    }else{
      callback()
    }
    
  }

  passwordValidate = (rule,value,callback) => {
    console.log(value)
     const password = value;
     const reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
     if(reg.test(password)){
        this.setState({ ...this.state, pass1: value})
         console.log("sí cumple")
         callback()
         
     }
     else{
         console.log("no cumple")
         callback('Elija una contraseña más segura. Pruebe con una combinación de letras números y símbolos')
     }

  }

  showModalPassword = () => {
    this.setState({
      visiblePassword: true,
    });
  };

   render(){
        
      const {getFieldDecorator} = this.props.form;
       return(
            <Form.Item>
              <Button onClick={this.showModalPassword} size='large' type="primary"  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                  Cambiar contraseña
              </Button>
              <Modal
                  onCancel={this.handleCancel}
                  title="Cambiar contraseña"
                  visible={this.state.visiblePassword}
                  footer={[
                    <Button key="back" onClick={this.handleCancelPassword}>
                      Cancelar
                    </Button>,
                    <Button key="save" onClick={this.changePassword}>
                      Guardar
                  </Button>
                  ]}
                >
                    <Form.Item label="Contraseña actual">
                        {getFieldDecorator('address1', {
                          
                        })(<Input 
                            placeholder='Contraseña actual'
                            size='large'
                            style={{backgroundColor:'#fff', borderColor:'#2F3E9E',borderRadius:10, width:'70%' }}
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
                        {getFieldDecorator('address2', {rules: [{ required:true, message: 'Ingresar la nueva contraseña' },{validator:this.passwordValidate}]
                        })(<Input 
                            placeholder='Nueva contraseña'
                            size='large'
                            style={{backgroundColor:'#fff', borderColor:'#2F3E9E',borderRadius:10,width:'70%'}}
                    />)}
                    </Form.Item>

                    <Form.Item label="Confirmar nueva contraseña" hasFeedback>
                        
                        {getFieldDecorator('address3', {rules: [{ required:true, message: 'Confirmar contraseña' },{validator:this.passwordConfirm}]
                        })(<Input 
                            placeholder='Confirmar nueva contraseña'
                            size='large'
                            style={{backgroundColor:'#fff', borderColor:'#2F3E9E',borderRadius:10,width:'70%' }}
                    />)}
                          
                    </Form.Item>
              </Modal>
            </Form.Item>
       )
   }

  }
  
  const ChangePassword = Form.create({ name: 'change_password' })(PasswordChangeForm);


  export default ChangePassword;


