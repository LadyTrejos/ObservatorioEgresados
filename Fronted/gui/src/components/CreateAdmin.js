import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
  } from 'antd';
import moment from 'moment';
import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';

import './CreateAdmin.css';
import history from '../helpers/history'

import NumericInput from './NumericInput'
  
  const { Option } = Select;

  

  class RegistrationForm extends React.Component {
    state = {
      
      id_phone:'',
      name:'', 
      last_name:'',
      id_type: '',
      id:'',
      email: '',
      address: '',
      country: '',
      region: '',
      city:'',
      phone:'',
    };

    
    
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          history.push('/ver-admins')
        }
      });
      
    };

    handleCreate = () => {
      axios.post('http://127.0.0.1:8000/users', {
        
      })
    }

    onChange = value => {
      this.setState({ phone: value });
    };

   


    disabledDate = (current) => {
      let min = "1942-01-01";
      return (
        (current && current < moment(min, "YYYY-MM-DD")) ||
        (current && current > moment().add(-20, "year"))
      );
    }

    

    
  
    render() {
      const { getFieldDecorator } = this.props.form;
      console.log(this.state)
  
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '57',
      })(
        <Select size='large' onChange={(value) => {this.setState({id_phone: value})}}>
          <Option value="57">+57</Option>
          <Option value="56">+56</Option>
        </Select>,
      );

      return (
        <Form layout="vertical" onSubmit={this.handleSubmit} >
          <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Crear administrador</h1>
          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item 
                label='Nombre(s)'
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Ingresar nombre(s)', whitespace: true },
                      {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([\u0020]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi,
                      message: 'Nombre no válido'}],
                })(<Input 
                      placeholder='Nombre(s)'
                      size='large'
                      onChange={e=>{this.setState({name: e.target.value})}}
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
                      onChange={e => {this.setState({last_name: e.target.value})}}
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>
          <br/>
          <Row gutter={0} type="flex" justify="center" align="middle">
            <Col span={3.5}>
              <Form.Item label="Tipo de documento">
                {getFieldDecorator('id_type', {
                  initialValue: 'CC', rules: [{ required:true, message: 'Ingresar el documento de identidad' }],
                })(
                  <Select 
                    size='large'
                    onChange={(value) => {this.setState({id_type: value})}}
                    >

                    <Option value="TI">Tarjeta de identidad</Option>
                    <Option value="CC">Cédula</Option>
                    <Option value="PA">Pasaporte</Option>
                    <Option value="CE">Cédula de extranjería</Option>
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
                    onChange={e => {this.setState({id: e.target.value})}} 
                    placeholder='Documento de identidad'
                    style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}} />)}
              </Form.Item>
            </Col>
          </Row>

            <br/>

          {/*<Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Fecha de nacimiento">
                {getFieldDecorator('Birthday')(
                  <DatePicker
                    placeholder='Seleccione fecha'
                    size='large'
                    onChange={e => {this.setState({birthday: e.format('YYYY-MM-DD')})}} 
                    format="DD-MM-YYYY"
                    disabledDate={this.disabledDate}
                    initialValue={moment().add(-20, 'year')}
                  />
                  )}
              </Form.Item>
            </Col>
                </Row>*/}

          {/*<Row  type="flex" justify="center" align="middle">
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
                      type: 'email',
                      message: 'Correo no válido',
                    },
                    {
                      required: true,
                      message: 'Ingresar correo electrónico',
                    },
                  ],
                })(<Input 
                      placeholder='ejemplo@dominio.com'
                      size='large'
                      onChange={e => {this.setState({email: e.target.value})}}
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
                      onChange={e => {this.setState({address: e.target.value})}}
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10 }}
                />)}
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Número de celular">
                {getFieldDecorator('phone', {
                  
                  rules: [{ required: true, message: 'Ingresar número telefónico' }]
                
                })(
                  <NumericInput 
                    size='large'
                    addonBefore={prefixSelector}
                    onChange={this.onChange}
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
                    <Select size='large'
                     placeholder='País' 
                     onChange={(value) => {this.setState({country: value})}}  >
                        <Option value="CO">Colombia</Option>
                                             
                    </Select>
                  )}
                </Form.Item>
            </Col>
            
            <Col span={5}>
              <Form.Item label=".">
                  {getFieldDecorator('Region', {
                    rules: [{ required:false, message: 'Ingresar región' }],
                  })(
                    <Select size='large' 
                    placeholder='Región'  
                    onChange={(value) => {this.setState({region: value})}}
                     >
                      <Option value="RI">Risaralda</Option>
                        
                      
                    </Select>
                  )}
                </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item label=".">
                  {getFieldDecorator('City', {
                    rules: [{ required:false, message: 'Ingresar cuidad' }],
                  })(
                    <Select size='large' 
                            placeholder='Ciudad'  
                            onChange={(value) => {this.setState({city: value})}} >
                      <Option value="PE">Pereira</Option>
                        
                    </Select>
                  )}
                </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col>
              <Form.Item>
                <Button size='large' 
                        type="primary" 
                        onClick = {this.handleSubmit}
                        style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                        Crear
                </Button>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item>
                <Button size='large' type="primary" htmlType="submit" style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} onClick={this.props.logout} >
                    
                <Link to='/modificar-admin'>Cancelar</Link>
                </Button>
              </Form.Item>
            </Col>
          </Row>

          
        </Form>
      );
    }
  }
  
  const CreateAdmin = Form.create({ name: 'register' })(RegistrationForm);
  
  
  
  export default withRouter(CreateAdmin);