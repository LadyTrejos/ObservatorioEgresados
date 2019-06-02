import React from 'react';
import {
    Form,
    Input,
    Select,
  } from 'antd';
  
  const { Option } = Select;

  class RegistrationForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };
  
    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    onChange = e => {
      const { value } = e.target;
      const reg = /^(0|[1-9][0-9]*)([0-9]*)?$/;
      if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.props.onChange(value);
      }
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
  
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '57',
      })(
        <Select style={{ width: 70 }}>
          <Option value="57">+57</Option>
          <Option value="56">+56</Option>
        </Select>,
      );
  
      
      return (
        <Form {...formItemLayout} onSubmit={this.handleSubmit} >
         
          
          <Form.Item
            label='Nombre(s)'
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Por favor ingresar nombre(s)', whitespace: true }],
            })(<Input placeholder='Nombre(s)'/>)}

          </Form.Item>

          <Form.Item
            label='Apellido(s)'
          >
            {getFieldDecorator('lastname', {
              rules: [{ required: true, message: 'Por favor ingresar apellido(s)', whitespace: true }],
            })(<Input placeholder='Apellido(s)'/>)}

          </Form.Item>


          <Form.Item label="Número Celular">
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: 'Por favor ingresar número telefónico' }],
            })(
              <Input 
                {...this.props}
                addonBefore={prefixSelector} 
                style={{ width: '100%' }} 
                placeholder='Ej: 1234567890' 
                onChange={this.onChange}/>)}
          </Form.Item>

          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input placeholder='ejemplo@dominio.com'/>)}
          </Form.Item>

        </Form>
      );
    }
  }
  
  const CreateAdmin = Form.create({ name: 'register' })(RegistrationForm);
  
  export default CreateAdmin;