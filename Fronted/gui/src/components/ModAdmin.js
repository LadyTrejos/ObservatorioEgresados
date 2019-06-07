import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    Modal
  } from 'antd';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

import history from '../helpers/history'
import './CreateAdmin.css';

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
        is_admin: true
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
    axios.get(`http://127.0.0.1:8000/api/admins/${adminID}`)
    .then(res => {
      this.setState({ 
        userInfo: {
          name: res.data.user.name,
          last_name: res.data.user.last_name,
          id_type: res.data.user.id_type,
          id: res.data.user.id,
          email: res.data.user.email,
          country: res.data.user.country,
          region: res.data.user.region,
          city: res.data.user.city
        }, 
        adminInfo : {
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
      initialValue: this.state.adminInfo.id_phone,
      rules: [{required:true, message: 'Ingresar indicativo'}]
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
          <Col span={7}>
            <Form.Item 
              label='Nombre(s)'
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Ingresar nombre(s)', whitespace: true},
                  {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                  message: "Nombre no válido"}],
                initialValue: this.state.userInfo.name
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
                rules: [{ required: true, message: 'Ingresar apellido(s)', whitespace: true },
                  {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                  message: "Apellido no válido"}],
                initialValue: this.state.userInfo.last_name
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
              {getFieldDecorator('id_type', {
                rules: [{ required:true, message: 'Ingresar el documento de identidad' }], 
                initialValue: this.state.userInfo.id_type
              })(
                <Select size='large'>
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
                  style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF', borderRadius:10}} />)}
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
                    style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}
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
                    style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10 }}
              />)}
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle">
          <Col span={7}>
            <Form.Item label="Número de celular">
              {getFieldDecorator('phone', {
                rules: [{ required: false, message: 'Ingresar número telefónico' }],
                initialValue: this.state.adminInfo.phone
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
          <Col span={2.5}>
            <Form.Item>
              <Button onClick={this.showModal} size='large' type="primary"  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                  Desactivar cuenta
              </Button>
              <Modal
                  title="Confirmación"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="back" onClick={() => this.handleCancel}>
                      Cancelar
                    </Button>,
                    <Button key="submit" htmlType="submit" type="primary" onClick={() => this.handleOk}>
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
              <Button size='large' type="primary" htmlType="submit" onClick={() => this.handleSave} style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                Guardar
              </Button>
            </Form.Item>
          </Col>

          <Col >
            <Form.Item>
              <Button size='large' type="primary" htmlType="submit" style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} onClick={() => this.props.logout} >
                  
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