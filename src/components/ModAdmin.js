import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    Modal,
    message
  } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import history from '../helpers/history';
import NumericInput from './NumericInput';
import HOSTNAME from '../helpers/hostname';

const { Option } = Select;

class ModAdmins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const adminID = this.props.match.params.id;
    axios.get(`${HOSTNAME}/api/users/${adminID}/`)
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
    axios.get(`${HOSTNAME}/api/admins/${adminID}/`)
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
        axios.put(`${HOSTNAME}/api/users/${adminID}/`, 
                    userData, 
                    { headers: {"Content-Type": "application/json"}})
        .then(() => {
            axios.put(`${HOSTNAME}/api/admins/${adminID}/`, 
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
    this.setState({ userInfo: {
      ...this.state.userInfo, is_active: !this.state.userInfo.is_active
    }}, () => {
      const userData = JSON.stringify({'is_active': this.state.userInfo.is_active})
      axios.patch(`${HOSTNAME}/api/users/${this.state.userInfo.id}/`,
                  userData,
                  { headers: {"Content-Type": "application/json"}})
      .then(() => {
        let action = this.state.userInfo.is_active ? "activado" : "desactivado"
        message.success(`El administrador ha sido ${action}.`)
      })
      .catch(err => {
        console.log(err.message)
    })
  })
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
        <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Modificar administrador</h1>
        <Row  type="flex" justify="center" align="middle">
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
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
          
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
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
          <Col xs={10} sm={6} md={4} lg={4} xl={4}>
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

          <Col xs={10} sm={6} md={4} lg={4} xl={4}> 
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
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
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
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
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
          <Col xs={20} sm={16} md={12} lg={7} xl={7}>
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
          <Col xs={16} sm={12} md={8} lg={3} xl={3}>
            <Form.Item>
              <Button onClick={this.showModal} size='large' type="primary"  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                  {this.state.userInfo.is_active ? "Desactivar cuenta" : "Activar cuenta"}
              </Button>
              <Modal
                  onCancel={this.handleCancel}
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

        <Row type="flex" justify="center" align="middle" gutter={10}>
          <Col xs={15} sm={11} md={7} lg={2} xl={2}>
            <Form.Item>
              <Button size='large' type="primary" onClick={(e) => this.handleSave(e)} style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                Guardar
              </Button>
            </Form.Item>
          </Col>

          <Col xs={15} sm={11} md={7} lg={2} xl={2}>
            <Form.Item>
              <Button 
                  size='large' 
                  type="primary" 
                  htmlType="submit" 
                  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}} 
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

const ModAdmin = Form.create({ name: 'ModAdmin' })(ModAdmins);



export default withRouter(ModAdmin);