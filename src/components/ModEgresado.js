import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    DatePicker,
    Button,
    Modal,
    message
  } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import history from '../helpers/history';
import HOSTNAME from '../helpers/hostname';

const { Option } = Select;

class ModificarEgresado extends React.Component {
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
        is_graduated: true,
        is_admin: false,
        is_active: true
      },
      egresadoInfo: {
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
    const egreID = this.props.match.params.id;
    axios.get(`${HOSTNAME}/api/users/${egreID}/`)
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
    axios.get(`${HOSTNAME}/api/egresados/${egreID}/`)
    .then(res => {
      this.setState({
        egresadoInfo : {
          user: res.data.user,
          date_of_birth: res.data.date_of_birth,
          genre: res.data.genre,
          interests: res.data.interests,
          friends: res.data.interests
        }
      })
    })

}

  handleSave = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userData = JSON.stringify(this.state.userInfo)
        const egresadoData = JSON.stringify(this.state.egresadoInfo)
        const egreID = this.props.match.params.id;
        axios.put(`${HOSTNAME}/api/users/${egreID}/`,
                    userData,
                    { headers: {"Content-Type": "application/json"}})
        .then(() => {
            axios.put(`${HOSTNAME}/api/egresados/${egreID}/`,
                    egresadoData,
                    { headers: {"Content-Type": "application/json"}})
            history.push('/ver-egresados')
        })
        .catch(err => {
          console.log(err.message)
        })
      }
    })
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
        message.success(`El egresado ha sido ${action}.`)
      })
      .catch(err => {
        console.log(err.message)
    })
    })
  }

  handleCancel = e => {
    
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  disabledDate = (current) => {
    let min = "01-01-1942";
    return (
      (current && current < moment(min, "DD-MM-YYYY")) ||
      (current && current > moment().add(-20, "year"))
    );
  }

  render() {
    
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit} >
        <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Modificar egresado</h1>
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
            <Form.Item label="Fecha de nacimiento">
              {getFieldDecorator('date_of_birth', {
                initialValue: moment(this.state.egresadoInfo.date_of_birth, "DD-MM-YYYY")
                
              })(<DatePicker
                placeholder='Seleccione fecha'
                size='large'
                format="DD-MM-YYYY"
                onChange={(date, dateString) => this.setState({  egresadoInfo: {...this.state.egresadoInfo, date_of_birth: dateString }})}
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
                  initialValue: this.state.egresadoInfo.genre
              })(
                  <Select 
                  placeholder="Seleccione una opción"
                  size='large'
                  onChange={ value => this.setState({ egresadoInfo: { ...this.state.egresadoInfo, genre: value } })}
                  >
                  <Option value="F">Femenino</Option>
                  <Option value="M">Masculino</Option>
                  <Option value="P">Prefiere no responder</Option>
                  </Select>
                  )}
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
                  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}
                  onClick={() => history.push('/ver-egresados')}
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

const ModEgresado = Form.create({ name: 'ModEgresado' })(ModificarEgresado);



export default withRouter(ModEgresado);
