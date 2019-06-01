import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './LoginForm.css'


class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const stylesObj = {
        background: '#2F3E9E'
      };
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
            </div>
        </div>
        
    );
  }
}



const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginForm);

export default WrappedNormalLoginForm;