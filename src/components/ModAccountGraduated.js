import React from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    Button,
    Modal,
    message
  } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import * as actions from '../store/actions/auth';

import NumericInput from './NumericInput';
import history from '../helpers/history';
import HOSTNAME from '../helpers/hostname';
//import ChangePassword from './ChangePassword'

const { Option } = Select;

class ModAccountGraduated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: true,
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
        is_graduated: true,
        is_admin: false,
        is_active: true
      },
      graduatedInfo: {
        user: '',
        date_of_birth: '',
        genre: '',
        interests: '',
        friends: ''
      },
      phonecodeItems: []
    };
    this.countryRef = React.createRef();
  }
  
  componentWillMount(){
    const graduatedID = localStorage.getItem('user');
    axios.get(`${HOSTNAME}/api/users/${graduatedID}/`)
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
    axios.get(`${HOSTNAME}/api/egresados/${graduatedID}/`)
    .then(res => {
      this.setState({
        graduatedInfo : {
            user: res.data.user,
            date_of_birth: res.data.date_of_birth,
            genre: res.data.genre,
            interests: res.data.interests,
            friends: res.data.interests
        }
      })
    })
        
}
changeProfile = () =>{
  
  if (this.state.profile){
    this.setState({ profile: false })
  }
  else{
    this.setState({ profile: true })
    window.location.reload();
  }
  
}

  
  handleSave = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userData = JSON.stringify(this.state.userInfo)
        const graduatedData = JSON.stringify(this.state.graduatedInfo)
        const graduatedID = localStorage.getItem('user');
        axios.put(`${HOSTNAME}/api/users/${graduatedID}/`, 
                    userData, 
                    { headers: {"Content-Type": "application/json"}})
        .then(() => {
            axios.put(`${HOSTNAME}/api/egresados/${graduatedID}/`, 
                    graduatedData, 
                    { headers: {"Content-Type": "application/json"}})
            history.push('/perfilEgresado')
            window.location.reload();
            this.state.profile ? this.setState({ profile: false }):this.setState({ profile: true })
            
          
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
      let action = this.state.userInfo.is_active ? "activada" : "desactivada"
      message.success(`Su cuenta ha sido ${action}.`)
      this.props.logout()

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
    const prefixSelector = getFieldDecorator('prefix')(
      <Select 
        size='large' 
        onChange={(value) => this.setState({ graduatedInfo: { ...this.state.graduatedInfo, id_phone: value } })}
      >
        {this.state.phonecodeItems}
      </Select>,
    );
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit} >
        <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>{this.state.profile ? "Perfil" : "Modificar perfil"}</h1>
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
                    readOnly={this.state.profile}
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
                    readOnly={this.state.profile}
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
            <Form.Item label="Fecha de nacimiento">
              {getFieldDecorator('date_of_birth', {
                initialValue: moment(this.state.graduatedInfo.date_of_birth, "DD-MM-YYYY")
                
              })(<DatePicker
                placeholder='Seleccione fecha'
                size='large'
                format="DD-MM-YYYY"
                onChange={(date, dateString) => this.setState({  graduatedInfo: {...this.state.graduatedInfo, date_of_birth: dateString }})}
                disabledDate={this.disabledDate}
                disabled

              />)}
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" justify="center" align="middle">
          <Col span={7}>
          <Form.Item label="Género: " hasFeedback>
              {getFieldDecorator('genre', {
                  rules: [{ required:true, message: '¿Cuál es su género?' }],
                  initialValue: this.state.graduatedInfo.genre
              })(
                  <Select 
                  placeholder="Seleccione una opción"
                  size='large'
                  onChange={ value => this.setState({ graduatedInfo: { ...this.state.graduatedInfo, genre: value } })}
                  disabled={this.state.profile}
                  >
                  <Option value="F">Femenino</Option>
                  <Option value="M">Masculino</Option>
                  <Option value="P">Prefiere no responder</Option>
                  </Select>
                  )}
          </Form.Item>
          </Col>
        </Row>

        {/*<Row type="flex" justify="center" align="middle">
          <Col span={2.5}>
          <ChangePassword/>
          </Col>
              </Row>*/}
        
        <Row type="flex" justify="center" align="middle">
          <Col span={2.5}>
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

        { !this.state.profile ?
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
                    onClick={this.changeProfile}
                >
                Cancelar
                </Button>
                
            </Form.Item>
          </Col>
          
        </Row>
        :
        <Row type="flex" justify="center" align="middle" gutter={20}>
          <Button
            size='large' 
            type="primary" 
            htmlType="submit" 
            style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} 
            onClick={this.changeProfile}>
            Editar datos
          </Button>
        </Row>
                }

        
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error
  }
}

const ModAccGraduated = Form.create({ name: 'ModAccGraduated' })(ModAccountGraduated);
const mapDispatchToProps = dispatch => {
    return {
      logout: () => dispatch(actions.logout())
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModAccGraduated));