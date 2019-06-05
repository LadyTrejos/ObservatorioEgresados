import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    DatePicker,
    Button,
    Modal
  } from 'antd';
import moment from 'moment';
import history from '../helpers/history'

import { withRouter, Link } from 'react-router-dom';

import './CreateAdmin.css';
  
  const { Option } = Select;

  

  class ModAdmins extends React.Component {
    state = {
      
    };
    
  
    handleSave = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('save');
          history.push('/');
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

    disabledDate = (current) => {
      let min = "1942-01-01";
      return (
        (current && current < moment(min, "YYYY-MM-DD")) ||
        (current && current > moment().add(-20, "year"))
      );
    }

    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
  
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };

    showModal = () => {
      this.setState({
        visible: true,
      });
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
  
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '57',
      })(
        <Select style={{ width: 70 }}>
          <Option value="57">+57</Option>
          <Option value="56">+56</Option>
        </Select>,
      );

      return (
        <Form layout="vertical" onSubmit={this.handleSubmit} >
          <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Modificar administrador</h1>
          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item 
                label='Nombre(s)'
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Ingresar nombre(s)', whitespace: true }],
                })(<Input 
                      placeholder='Nombre(s)'
                      size='large'
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>
          <Row  type="flex" justify="center" align="middle">
            
            <Col span={7}>
              <Form.Item 
                label='Apellido(s)'
              >
                {getFieldDecorator('lastname', {
                  rules: [{ required: true, message: 'Ingresar apellido(s)', whitespace: true }],
                })(<Input 
                      placeholder='Apellido(s)'
                      size='large'
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>
          <br/>
          <Row gutter={0} type="flex" justify="center" align="middle">
            <Col span={3.5}>
              <Form.Item label="Tipo de documento">
                {getFieldDecorator('TypeDNI', {
                  initialValue: 'Cédula', rules: [{ required:true, message: 'Ingresar el documento de identidad' }],
                })(
                  <Select size='large'>
                    <Option value="TI">Tarjeta de identidad</Option>
                    <Option value="Cédula">Cédula</Option>
                    <Option value="Pasaporte">Pasaporte</Option>
                    <Option value="CédulaExtranjería">Cédula de extranjería</Option>
                  </Select>
                 )}
              </Form.Item>

            </Col>

            
            <Col span={4.5}> 
              <Form.Item label="Documento de identidad">
                {getFieldDecorator('DNI', {
                  rules: [{ required:true, message: 'Ingresar el documento de identidad' }],
                })(
                  <Input
                    size='large'  
                    placeholder='Documento de identidad'
                    style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}} />)}
              </Form.Item>
            </Col>
          </Row>

            <br/>

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Fecha de nacimiento">
                {getFieldDecorator('Birthday')(
                  <DatePicker
                    placeholder='Seleccione fecha'
                    size='large'
                    format="DD-MM-YYYY"
                    disabledDate={this.disabledDate}
                    initialValue={moment().add(-20, 'year')}
                  />
                  )}
              </Form.Item>
            </Col>
          </Row>

         {/* <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Género">
                {getFieldDecorator('genre', {
                  initialValue: 'Prefiero no contestar',
                })(
                  <Select size='large'>
                    <Option value="Hombre">Hombre</Option>
                    <Option value="Mujer">Mujer</Option>
                    <Option value="NoContestar">Prefiero no contestar</Option>
                  </Select>
                 )}
              </Form.Item>
            </Col>
                </Row>*/}

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Correo electrónico">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: 'Ingresar correo electrónico',
                    },
                  ],
                })(<Input 
                      placeholder='ejemplo@dominio.com'
                      size='large'
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}
              </Form.Item>
            </Col>
          </Row>

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Dirección">
                {getFieldDecorator('address', {
                })(<Input 
                      placeholder='Cr 27 Cll 4 # 45-56'
                      size='large'
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10 }}
                />)}
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Número Celular">
                {getFieldDecorator('phone', {
                  rules: [{ required: false, message: 'Ingresar número telefónico' }],
                })(
                  <Input 
                    size='large'
                    addonBefore={prefixSelector} 
                    placeholder='Ej: 1234567890'
                    style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col span={5}>
              <Form.Item label="Lugar de residencia">
                  {getFieldDecorator('Country', {
                    rules: [{ required:false, message: 'Ingresar país' }],
                  })(
                    <Select size='large' placeholder='País'>
                      
                    </Select>
                  )}
                </Form.Item>
            </Col>
            
            <Col span={5}>
              <Form.Item label=".">
                  {getFieldDecorator('Region', {
                    rules: [{ required:false, message: 'Ingresar región' }],
                  })(
                    <Select size='large' placeholder='Región'>
                      
                    </Select>
                  )}
                </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item label=".">
                  {getFieldDecorator('City', {
                    rules: [{ required:false, message: 'Ingresar cuidad' }],
                  })(
                    <Select size='large' placeholder='Ciudad'>
                      
                    </Select>
                  )}
                </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col span={2.5}>
              <Form.Item>
                <Button onClick={this.showModal} size='large' type="primary" htmlType="submit" style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                   Desactivar cuenta
                </Button>
                <Modal
                    title="Confirmación"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                      <Button key="back" onClick={this.handleCancel}>
                        Cancelar
                      </Button>,
                      <Button key="submit" htmlType="submit" type="primary" onClick={this.handleOk}>
                        <Link to='/'>Desactivar</Link>
                      </Button>,
                    ]}
                  >
                    <p>¿Está seguro que desea desactivar la cuenta?</p>
                </Modal>
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle" gutter={20}>
            <Col >
              <Form.Item>
                <Button size='large' type="primary" htmlType="submit" onClick={this.handleSave} style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                  Guardar
                </Button>
              </Form.Item>
            </Col>

            <Col >
              <Form.Item>
                <Button size='large' type="primary" htmlType="submit" style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} onClick={this.props.logout} >
                    
                <Link to='/'>Cancelar</Link>
                </Button>
              </Form.Item>
            </Col>
          </Row>

          
        </Form>
      );
    }
  }
  
  const ModAdmin = Form.create({ name: 'ModAdmin' })(ModAdmins);
  
  
  
  export default withRouter(ModAdmin);