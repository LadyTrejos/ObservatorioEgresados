import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    message
  } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { withRouter, } from 'react-router-dom';

import NumericInput from './NumericInput';
import CountrySelector from './CountrySelector';
import history from '../helpers/history';
import HOSTNAME from '../helpers/hostname';
  
const { Option } = Select;


class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo:{
        email: '',
        password1: '',
        password2: '',
        name:'', 
        last_name:'',
        id:'',
        id_type: 'CC',
        country: '',
        region: '',
        city:'',
        is_graduated: false,
        is_admin: true
      },
      adminInfo: {
        address: '',
        phone: null,
        id_phone: null,
      },
      phonecodeItems: []
    };
    this.countryRef = React.createRef();
  }

  makeRandomPassword = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  
  
  handleCreate = e => {
    e.preventDefault();
    const selector = this.countryRef.current;
    const password = this.makeRandomPassword();
    console.log(password)

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ userInfo: { ...this.state.userInfo, 
          country: selector.state.country,
          region: selector.state.region,
          city: selector.state.city,
          password1: password,
          password2: password},
          adminInfo: { ...this.state.adminInfo, user: this.state.userInfo.id}
        },
          () => {
            const userData = JSON.stringify(this.state.userInfo)
            const adminData = JSON.stringify(this.state.adminInfo)
            console.log(userData);
            console.log(adminData);
            axios.post(`${HOSTNAME}/rest-auth/registration/`, 
                        userData, 
                        { headers: {"Content-type": "application/json"}})
            .then(() => {
                axios.post(`${HOSTNAME}/api/admins/`, 
                        adminData, 
                        { headers: {"Content-type": "application/json"}})
                .then(() => {
                  message.success('El administrador ha sido creado con éxito.' )
                  history.push('/ver-admins')
                })
            })
            .catch(err => {
              console.log(err.message)
            })
          }
        )
      }
    });
    
  };

  disabledDate = (current) => {
    let min = "1942-01-01";
    return (
      (current && current < moment(min, "YYYY-MM-DD")) ||
      (current && current > moment().add(-20, "year"))
    );
  }

  componentDidMount(){
    const selector = this.countryRef.current;
    this.setState({
      phonecodeItems: selector.state.phonecodeItems
    })
  }

  getPattern = (rule, value, callback) => {
    let reg = null;
    // Expresión regular dependiendo del tipo de documento seleccionado
    if ( this.state.userInfo.id_type === 'PA'){
      reg = /^[A-Z]{2}[0-9]{6}$/;
    } else {
      reg = /^[0-9]{6,10}$/
    }
    // Verificar si se cumple la expresión regular
    if(value && !reg.test(value)){
      callback('El documento ingresado no es válido')
    } else {
      callback();
    }
    
  };

  

  render() {

    const { getFieldDecorator } = this.props.form;
   
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: "Indicativo",
      rules: [{required:true, message: 'Ingresar indicativo'}]
    })(
      <Select 
        showSearch
        size='large' 
        style={{minWidth: '10vw'}}
        onChange={(value) => this.setState({ adminInfo: { ...this.state.adminInfo, id_phone: value } })}
      >
        {this.state.phonecodeItems}
      </Select>,
    );

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit} >
        <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>
          Crear administrador
        </h1>
        <Row type="flex" justify="center" >
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
            
            <Form.Item label='Nombre(s)'>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Ingresar nombre(s)'},
                        {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                        message: "Nombre no válido"}],
              })(<Input 
                    placeholder='Nombre(s)'
                    size='large'
                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, name: e.target.value } }) }
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>
                )}
            </Form.Item>
          </Col>
        </Row>

        <Row  type="flex" justify="center" align="middle">
          
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
            <Form.Item label='Apellido(s)'>
              {getFieldDecorator('lastname', {
                rules: [{ required: true, message: 'Ingresar apellido(s)'},
                {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                  message: "Apellido no válido"}],
              })(<Input 
                    placeholder='Apellido(s)'
                    size='large'
                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, last_name: e.target.value } })}
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>
                )}
            </Form.Item>
          </Col>
        </Row>
        <br/>

        <Row gutter={0} type="flex" justify="center" align="middle">
          <Col xs={10} sm={6} md={4} lg={4} xl={4}>
            <Form.Item label="Tipo de documento">
              {getFieldDecorator('id_type', {
                initialValue: 'CC', rules: [{ required:true, message: 'Ingresar el tipo de documento' }],
              })(
                <Select 
                  size='large'
                  onChange={ value => this.setState({ userInfo: { ...this.state.userInfo, id_type: value } })}
                >
                  <Option value="TI">Tarjeta de identidad</Option>
                  <Option value="CC">Cédula</Option>
                  <Option value="PA">Pasaporte</Option>
                  <Option value="CE">Cédula de extranjería</Option>
                </Select>
                )}
            </Form.Item>
          </Col>

          <Col xs={10} sm={6} md={4} lg={4} xl={4}> 
            <Form.Item label="Documento de identidad">
              {getFieldDecorator('id', {
                rules: [{ required:true, message: 'Ingresar el documento de identidad' }, 
              {validator: this.getPattern }
              ]
              })(

                <Input
                  size='large' 
                  placeholder='Documento de identidad'
                  style={{backgroundColor:'#fff', borderColor:'#fff', borderRadius:10}}
                  onChange={ e => this.setState({ userInfo: { ...this.state.userInfo, id: e.target.value } }) }>
                </Input>

                )}
            </Form.Item>
          </Col>
        </Row>
        <br/>

        <Row  type="flex" justify="center" align="middle">
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
            <Form.Item label="Correo electrónico">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'El correo no es válido',
                  },
                  {
                    required: true,
                    message: '¿Cuál es su correo electrónico?',
                  },
                ],
              })(<Input 
                    placeholder='ejemplo@dominio.com'
                    size='large'
                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, email: e.target.value } })}
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>
                )}
            </Form.Item>
          </Col>
        </Row>

        <Row  type="flex" justify="center" align="middle">
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
            <Form.Item label="Dirección">
              {getFieldDecorator('address',  {rules: [{ required:true, message: '¿Dónde se realizará?' },
                  {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[0-9a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da\-#]+)*$/gi, 
                    message: "Dirección no válida"}],}
              )(<Input 
                    placeholder='Cr 27 Cll 4 # 45-56'
                    size='large'
                    onChange={e => this.setState({ adminInfo: { ...this.state.adminInfo, address: e.target.value } })}
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10 }}
              />)}
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle">
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
            <Form.Item label="Número de celular">
              {getFieldDecorator('phone', {
                rules:[ {pattern:/^[0-9]{10}$/gi, message:'El número debe contener 10 dígitos'}]
              })(
                <NumericInput 
                  size='large'
                  addonBefore={prefixSelector}
                  onChange={value => this.setState({ adminInfo: { ...this.state.adminInfo, phone: value } })}
                  placeholder='Ej: 1234567890'
                  style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>)}
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle">
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
            <Form.Item label="Lugar de residencia: ">
              <CountrySelector ref={this.countryRef}/>
						</Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle">
          <Col>
            <Form.Item>
              <Button size='large' 
                      type="primary" 
                      onClick={this.handleCreate}
                      style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                Crear
              </Button>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item>
              <Button size='large' 
                      type="primary" 
                      href="/ver-admins"
                      style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}} 
              >    
              Cancelar
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