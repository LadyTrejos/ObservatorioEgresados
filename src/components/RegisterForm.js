import React from 'react';
import { Form, Icon, Input, Button, Spin, Select, DatePicker, Checkbox, Tooltip, Alert } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import axios from 'axios';
import moment from 'moment';
import ReCAPTCHA from 'react-google-recaptcha';


import '../App.css';
import './RegisterForm.css'
import logo from '../static/img/logo.png'
import history from '../helpers/history';
import CountrySelector from '../components/CountrySelector';
import HOSTNAME from '../helpers/hostname';

const { Option } = Select;

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class RegisterForm extends React.Component {
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
            id_type: '',
            country: '',
            region: '',
            city:'',
            is_graduated: true,
            is_active: false,
            is_admin:false,

          },
          egresadoInfo: {
            user:'',
            date_of_birth: '',
            genre: '',
            interests: [],
            friends:[]
          },
          captcha: false
        };
        
        this.countryRef = React.createRef();
      }

  handleSubmit = e => {
    const selector = this.countryRef.current;
    console.log(JSON.stringify(this.state.userInfo))
    console.log(JSON.stringify(this.state.egresadoInfo))
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ userInfo: { ...this.state.userInfo, 
          country: selector.state.country,
          region: selector.state.region,
          city: selector.state.city,
          },
          adminInfo: { ...this.state.adminInfo, user: this.state.userInfo.id}
        },
        () => {
          const userData = JSON.stringify(this.state.userInfo)
          const egresadoData = JSON.stringify(this.state.egresadoInfo)
          axios.post(`${HOSTNAME}/rest-auth/registration/`, 
                          userData, 
                        { headers: {"Content-type": "application/json"}})
            .then(() => {
                axios.post(`${HOSTNAME}/api/egresados/`, 
                        egresadoData, 
                        { headers: {"Content-type": "application/json"}})
                .then(() => 
                    <Alert
                        message="Success Tips"
                        description="Detailed description and advice about successful copywriting."
                        type="success"
                        showIcon
                        />
                  
                )
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
    let min = "01-01-1942";
    return (
      (current && current < moment(min, "DD-MM-YYYY")) ||
      (current && current > moment().add(-20, "year"))
    );
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Las contraseñas no coinciden.');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  onChangeCaptcha = () => {
    this.setState({ captcha: true });
  };

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
    const stylesObj = {
        background: '#2F3E9E'
      };
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <p>{ this.props.error.message }</p>
      )
    }
    return (
        
        <div>
            <div style={{color:'#fff', backgroundColor:'#8796F0', textAlign: 'center', fontSize:'200%', height:'20%'}}>
              <img src={logo} alt="Logo de la página" style={{width: 40, height: 40}}/>
              <strong>Observatorio de egresados</strong>
            </div>

            <div style={stylesObj} className="container">
            
            </div>
            <div className='Div2'>
                <h1 className='h1Ya'>¿Ya tienes una cuenta?</h1>
                <Button 
                    className='ButtonLog'
                    onClick={() => history.push('/login')}
                    >
                    <strong>Inicia sesión</strong> 
                </Button>
                            
            </div>
            
            <div className='DivForm' id="formdiv" >
                <h1 className='h1IS'>Registrarse</h1>
                { errorMessage }
                {
                    this.props.loading ? 
                    <Spin indicator={antIcon} />
                    :
                    <Form onSubmit={this.handleSubmit} className='Input'>                    
                        <Form.Item label='Nombre(s)' hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Ingresar nombre(s)'},
                                        {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                                        message: "Nombre no válido"}],
                            })(<Input 
                                    placeholder='Nombre(s)'
                                    size='large'
                                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, name: e.target.value } }) }
                                    />
                                )}
                        </Form.Item>
                        <Form.Item label='Apellido(s)' hasFeedback>
                            {getFieldDecorator('lastname', {
                                rules: [{ required: true, message: 'Ingresar apellido(s)'},
                                {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                                message: "Apellido no válido"}],
                            })(<Input 
                                    placeholder='Apellido(s)'
                                    size='large'
                                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, last_name: e.target.value } })}
                                    />
                                )}
                        </Form.Item>
                        
                        <Form.Item label="Lugar de residencia">
                            <CountrySelector ref={this.countryRef}/>
                        </Form.Item>

                        <Form.Item label="Tipo de documento" hasFeedback>
                            {getFieldDecorator('id_type', {
                                rules: [{ required:true, message: 'Ingresar el tipo de documento' }],
                            })(
                                <Select 
                                placeholder="Seleccione un tipo"
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

                        <Form.Item label={<span>
                          Documento de identidad&nbsp;
                          
                          <Tooltip title="El documento debe tener al menos 6 dígitos y máximo 10.">
                            <Icon type="question-circle-o" />
                          </Tooltip>

                        </span>} hasFeedback>
                            {getFieldDecorator('id', {
                                rules: [{ required:true, message: 'Ingresar el documento de identidad' }, 
                            {validator: this.getPattern}
                            ]
                            })(

                                <Input
                                size='large' 
                                placeholder='Documento de identidad'
                                onChange={ e => this.setState({ 
                                    userInfo: { ...this.state.userInfo, id: e.target.value },
                                    egresadoInfo: { ...this.state.egresadoInfo, user: e.target.value }
                                    }) }>
                                </Input>

                                )}
                        </Form.Item>

                                          

                        <Form.Item label="Fecha de nacimiento: " hasFeedback>
                            {getFieldDecorator('date_of_birth')
                             (
                            <DatePicker
                                placeholder='Seleccione fecha'
                                size='large'
                                onChange={(date, dateString) => this.setState({ egresadoInfo: {...this.state.egresadoInfo, date_of_birth: dateString }})}
                                format="DD-MM-YYYY"
                                disabledDate={this.disabledDate}
                            />
                            )}
                        </Form.Item>

                        <Form.Item label="Género: " hasFeedback>
                            {getFieldDecorator('genre')(
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

                        <Form.Item label="Correo electrónico: " hasFeedback>
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
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder='ejemplo@dominio.com'
                                    size='large'
                                    onChange={e => this.setState({ userInfo: { ...this.state.userInfo, email: e.target.value } })}
                                    />
                                )}
                        </Form.Item>

                        <Form.Item label="Contraseña: " hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Ingrese su contraseña' },
                                {
                                validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input.Password
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                size="large"
                                placeholder="Contraseña"
                                onChange={e => this.setState({ userInfo: { ...this.state.userInfo, password1: e.target.value } })}
                                />,
                            )}
                        </Form.Item>

                        <Form.Item label="Confirmar contraseña: " hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                {
                                    required: true,
                                    message: 'Confirme la contraseña ingresada',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                                ],
                            })(<Input.Password 
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                size="large"
                                placeholder="Contraseña"
                                onChange={e => this.setState({ userInfo: { ...this.state.userInfo, password2: e.target.value } })}
                                onBlur={this.handleConfirmBlur}
                            />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('agreement', {
                                valuePropName: 'checked',
                                rules: [{required:true, message: "Debe aceptar la política de privacidad"}]
                            })(
                                <Checkbox>
                                    Acepto la <a href="/privacy" target="_blank">política de privacidad</a>
                                </Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('captcha', {
                                rules: [
                                {
                                    required: true,
                                    message: 'Confirme el CAPTCHA',
                                }
                                ],
                            })(
                                <ReCAPTCHA
                                    sitekey="6LctmasUAAAAANjaXDT7KQ2poDUbNRmY97QX4ygP"
                                    onChange={this.onChangeCaptcha}
                                />
                            )}
                        </Form.Item>
                        <br/>
                        <Button type="primary" htmlType="submit" size='large' disabled={!this.state.captcha} >
                            Registrarse
                        </Button>

                    </Form>
                }
            </div>
        </div>
        
    );
  }
}

const WrappedNormalRegisterForm = Form.create({ name: 'register_form' })(RegisterForm);

const mapStateToProps = state => {
    return {
      loading: state.loading,
      error: state.error
    }
  }
  
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(actions.authLogin(email, password))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedNormalRegisterForm));