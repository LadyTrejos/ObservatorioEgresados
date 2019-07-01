import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Icon,
    Tooltip,
    Button,
    Modal,
    message
  } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import history from '../helpers/history';
import NumericInput from './NumericInput';

const { Option } = Select;

class ModAccountAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        pass1:'',
        pass2:'',
      userInfo:{
        email: '',
        password: '',
        name:'', 
        last_name:'',
        id:'',
        id_type: '',
        country: '',
        region: '',
        city:'',
        is_graduated: false,
        is_admin: true,
        is_active: true
      },
      adminInfo: {
        address: '',
        phone:'',
        id_phone:'',
      },
      phonecodeItems: []
    };
    this.countryRef = React.createRef();
  }
  
  componentWillMount(){
    const adminID = localStorage.getItem('user');
    axios.get(`http://127.0.0.1:8000/api/users/${adminID}`)
    .then(res => {
      this.setState({ 
        userInfo: {
          name: res.data.name,
          last_name: res.data.last_name,
          password: res.data.password,
          id_type: res.data.id_type,
          id: res.data.id,
          email: res.data.email,
          country: res.data.country,
          region: res.data.region,
          city: res.data.city,
          is_active: res.data.is_active
        }
      })
    })
    axios.get(`http://127.0.0.1:8000/api/admins/${adminID}`)
    .then(res => {
      this.setState({
        adminInfo : {
          user: res.data.user,
          address: res.data.address,
          id_phone: res.data.id_phone,
          phone: res.data.phone
        }
      })
    })
        
}
  
  handleSave = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userData = JSON.stringify(this.state.userInfo)
        const adminData = JSON.stringify(this.state.adminInfo)
        const adminID = this.props.match.params.id;
        axios.put(`http://127.0.0.1:8000/api/users/${adminID}/`, 
                    userData, 
                    { headers: {"Content-Type": "application/json"}})
        .then(() => {
            axios.put(`http://127.0.0.1:8000/api/admins/${adminID}/`, 
                    adminData, 
                    { headers: {"Content-Type": "application/json"}})
            history.push('/ver-admins')
        })
        .catch(err => {
          console.log(err.message)
        })
      }
    });
    
  };

  handleDeactivate = e => {
    e.persist()
    this.setState({ userInfo: {
      ...this.state.userInfo, is_active: !this.state.userInfo.is_active
    }}, () => {
      this.handleSave(e)
      let action = this.state.userInfo.is_active ? "activado" : "desactivado"
      message.success(`El administrador ha sido ${action}.`)
    })
    
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancelPassword = e => {
    console.log(e);
    this.setState({
      visiblePassword: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showModalPassword = () => {
    this.setState({
      visiblePassword: true,
    });
  };

  passwordValidate = (rule,value,callback) => {
    console.log(value)
     const password = value;
     const reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
     if(reg.test(password)){
        this.setState({ ...this.state, pass1: value})
         console.log("sí cumple")
         
     }
     else{
         console.log("no cumple")
         callback('Elija una contraseña más segura. Pruebe con una combinación de letras números y símbolos')
     }

  }

  passwordConfirm = (rule,value,callback) => {
    
    
    if (value !== this.state.pass1){
        
        callback("Las contraseñas no coinciden")
    }
    
  }

  changePassword = () => {
    this.setState({ userInfo: {
      ...this.state.userInfo, password: this.state.pass1
    }})
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: this.state.adminInfo.id_phone,
    })(
      <Select 
        size='large' 
        onChange={(value) => this.setState({ adminInfo: { ...this.state.adminInfo, id_phone: value } })}
      >
        {this.state.phonecodeItems}
      </Select>,
    );
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit} >
        <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Modificar perfil</h1>
        <Row  type="flex" justify="center" align="middle">
          <Col span={7}>
            <Form.Item 
              label='Nombre(s)'
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Ingresar nombre(s)'},
                  {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                  message: "Nombre no válido"}],
                initialValue: this.state.userInfo.name
              })(<Input 
                    placeholder='Nombre(s)'
                    size='large'
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}
                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, name: e.target.value } }) }
                  />)}

            </Form.Item>
          </Col>
        </Row>
        <Row  type="flex" justify="center" align="middle">
          
          <Col span={7}>
            <Form.Item 
              label='Apellido(s)'
            >
              {getFieldDecorator('lastname', {
                rules: [{ required: true, message: 'Ingresar apellido(s)'},
                  {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                  message: "Apellido no válido"}],
                initialValue: this.state.userInfo.last_name
              })(<Input 
                    placeholder='Apellido(s)'
                    size='large'
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}
                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, last_name: e.target.value } })}
                  />)}
            </Form.Item>
          </Col>
        </Row>
        <br/>
        <Row gutter={0} type="flex" justify="center" align="middle">
          <Col span={3.5}>
            <Form.Item label="Tipo de documento">
              {getFieldDecorator('id_type', {
                rules: [{ required:true, message: 'Ingresar el documento de identidad' }], 
                initialValue: this.state.userInfo.id_type
              })(
                <Select size='large' disabled>
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
              {getFieldDecorator('id', {
                rules: [{ required:true, message: 'Ingresar el documento de identidad' }], 
                initialValue: this.state.userInfo.id
              })(
                <Input
                  size='large'  
                  placeholder='Documento de identidad'
                  readOnly
                  onChange={ e => this.setState({ userInfo: { ...this.state.userInfo, id: e.target.value } }) }
                  style={{backgroundColor:'#fff', borderColor:'#fff', borderRadius:10}} />)}
            </Form.Item>
          </Col>
        </Row>
        <br/>

        <Row  type="flex" justify="center" align="middle">
          <Col span={7}>
            <Form.Item label="Correo electrónico">
              {getFieldDecorator('email', {
                rules: [{
                    required: true,
                    message: 'Ingresar correo electrónico',
                  }],
                initialValue: this.state.userInfo.email
              })(<Input 
                    placeholder='ejemplo@dominio.com'
                    size='large'
                    readOnly
                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, email: e.target.value } })}
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>)}
            </Form.Item>
          </Col>
        </Row>

        <Row  type="flex" justify="center" align="middle">
          <Col span={7}>
            <Form.Item label="Dirección">
              {getFieldDecorator('address', {
                initialValue: this.state.adminInfo.address
              })(<Input 
                    placeholder='Cr 27 Cll 4 # 45-56'
                    size='large'
                    onChange={e => this.setState({ adminInfo: { ...this.state.adminInfo, address: e.target.value } })}
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10 }}
              />)}
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle">
          <Col span={7}>
            <Form.Item label="Número de celular">
              {getFieldDecorator('phone', {rules:[{pattern:/^[0-9]{10}$/gi,
              message:'El número debe contener 10 dígitos'}],
                initialValue: this.state.adminInfo.phone
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
          <Col span={2.5}>
            <Form.Item>
              <Button onClick={this.showModalPassword} size='large' type="primary"  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                  Cambiar contraseña
              </Button>
              <Modal
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
                        >
                        {getFieldDecorator('address2', {rules: [{ required:true, message: 'Ingresar la nueva contraseña' },{validator:this.passwordValidate}]
                        })(<Input 
                            placeholder='Nueva contraseña'
                            size='large'
                            style={{backgroundColor:'#fff', borderColor:'#2F3E9E',borderRadius:10,width:'70%'}}
                    />)}
                    </Form.Item>

                    <Form.Item label="Confirmar nueva contraseña">
                        
                        {getFieldDecorator('address3', {rules: [{ required:true, message: 'Confirmar contraseña' },{validator:this.passwordConfirm}]
                        })(<Input 
                            placeholder='Confirmar nueva contraseña'
                            size='large'
                            style={{backgroundColor:'#fff', borderColor:'#2F3E9E',borderRadius:10,width:'70%' }}
                    />)}
                          
                    </Form.Item>

                    
                 
              </Modal>
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle">
          <Col span={2.5}>
            <Form.Item>
              <Button onClick={this.showModal} size='large' type="primary"  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                  {this.state.userInfo.is_active ? "Desactivar cuenta" : "Activar cuenta"}
              </Button>
              <Modal
                  title="Confirmación"
                  visible={this.state.visible}
                  footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      Cancelar
                    </Button>,
                    <Button key="deactivate" type="danger" onClick={(e) => this.handleDeactivate(e)}>
                      {this.state.userInfo.is_active ? "Desactivar" : "Activar"}
                    </Button>,
                  ]}
                >
                  <p>{this.state.userInfo.is_active ? "¿Está seguro que desea desactivar esta cuenta?"
                    : "¿Está seguro que desea activar esta cuenta?"}</p>
              </Modal>
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle" gutter={20}>
          <Col >
            <Form.Item>
              <Button size='large' type="primary" onClick={(e) => this.handleSave(e)} style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                Guardar
              </Button>
            </Form.Item>
          </Col>

          <Col >
            <Form.Item>
              <Button 
                  size='large' 
                  type="primary" 
                  htmlType="submit" 
                  style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} 
                  onClick={() => history.push('/ver-admins')}
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

const ModAccAdmin = Form.create({ name: 'ModAdmin' })(ModAccountAdmin);



export default withRouter(ModAccAdmin);