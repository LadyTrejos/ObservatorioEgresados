import React from 'react';
import ReactDOM from 'react-dom';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    DatePicker,
    Button,
    Cascader,
    TimePicker,
    Checkbox,
    Icon,
    Upload,
    message,

  } from 'antd';

import moment from 'moment';
import { connect } from 'react-redux';

import { withRouter, Link } from 'react-router-dom';

import './CreateAdmin.css';

  const { Option } = Select;


  const { TextArea } = Input;
  /* Lugar*/
  const options = [
    {
      value: "colombia",
      label: "Colombia",
      children: [
        {
          value: "risaralda",
          label: "Risaralda",
          children: [
            {
              value: "Pereira",
              label: "pereira"
            },
            {
              value: "Santarosa",
              label: "Santa Rosa"
            }
          ]
        }
      ]
    },
    {
      value: "Estados unidos",
      label: "Estados Unidos",
      children: [
        {
          value: "Florida",
          label: "FLorida",
          children: [
            {
              value: "Miami ",
              label: "Miami"
            }
          ]
        }
      ]
    }
  ];

  /* intereses */
  const CheckboxGroup = Checkbox.Group;
  const plainOptions = ['Medicina', 'Veterinaria', 'Matematicas','Programacion','Deporte','Academia','Social',];
  const defaultCheckedList = ['Social','Academia'];
  class App extends React.Component {
  state = {
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
  };

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,


    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    return (
      <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup
          options={plainOptions}
          value={this.state.checkedList}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
/* fin de intereses*/
 /* imagenes*/
 function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}
class Avatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    );
  }
}
/* fin de imagenes */

  function onChange(value) {
    console.log(value);
  }
/* reloj*/
  class Demo extends React.Component {
    state = {
      value: null,
    };

    onChange = time => {
      console.log(time);
      this.setState({ value: time });
    };

    render() {
      return <TimePicker value={this.state.value} onChange={this.onChange} />;
    }
  }

  class createEvento extends React.Component {
    state = {
      name:'',
      description:'',
      place:'',
      date:'',
      hour:'',
      organizer:'',
      created_at:'',
      admin:'',
      interests:'',
      multimedia:'',
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

    disabledDate = (current) => {
      let min = "1942-01-01";
      return (
        (current && current < moment(min, "YYYY-MM-DD")) ||
        (current && current < moment().add( "year"))
      );


    }
    onChange2(dateString) {
      console.log('Formatted Selected Time: ', dateString);
    }

    disabledDate2 = (current) => {
      let min = "1942-01-01";
      return (
        (current && current == moment(current))

      );


    }
    onChange2(dateString) {
      console.log('Formatted Selected Time: ', dateString);
    }

    render() {
      const { getFieldDecorator } = this.props.form;

      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '57',
      })(
        <Select style={{ width: 70 }}>
          <Option value="57">+57</Option>
          <Option value="56">+56</Option>
          <Option value="59">+59</Option>
        </Select>,
      );


      return (
        <Form layout="vertical" onSubmit={this.handleSubmit} >
          <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Crear Evento</h1>


          <Row type="flex" justify="center" align="middle">
            <Col span={5}>
              <Form.Item label="Imagenes multimedia">
                  {getFieldDecorator('multimedia', )
                  (<Avatar />

                  )}
                </Form.Item>
            </Col>
          </Row>





          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item
                label='Nombre'
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'ingrese nombre del evento', whitespace: true }],
                })(<Input
                      placeholder='Nombre Evento'
                      size='large'
                      onChange={e => {this.setState({name: e.target.value})}}
                      onPressEnter={console.log("name: "+this.state.name)}
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>


          <Row  type="flex" justify="center" align="middle">

            <Col span={7}>
              <Form.Item
                label='Descripcion'
              >
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: 'ingrese descripcion de evento', whitespace: true }],
                })(<TextArea rows={4}
                      placeholder='Descripcion de evento'
                      size='large'
                      onChange={e => {this.setState({description: e.target.value})} }

                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>


          <br/>
          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Fecha de evento">
                {getFieldDecorator('date', {
                  rules: [{ required:true, message: 'fecha' }],
                }) (
                  <DatePicker
                    placeholder='Seleccione fecha'
                    size='large'
                    onChange={this.onChange2}
                    onPressEnter={console.log("birthday: "+this.state.birthday)}
                    format="DD-MM-YYYY"
                    disabledDate={this.disabledDate}

                  />
                  )}
              </Form.Item>

            </Col>


            <Col span={4.5}>
              <Form.Item label="Hora de evento">
                {getFieldDecorator('hour  ', {
                  rules: [{ required:true, message: 'Hora' }],
                })(
                  <Demo
                    size='large'
                    onChange={e => {this.setState({hour: e.target.value})}}
                    onPressEnter={console.log("DNI: "+this.state.DNI)}
                    placeholder='Documento de identidad'
                    style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}} />)}
              </Form.Item>
            </Col>
          </Row>

            <br/>

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Lugar del Evento">
                {getFieldDecorator('place', {
                  rules: [{ required:true, message: 'donde se realizara?' }],
                })(
                  <Cascader options={options} onChange={e => {this.setState({place: e.target.value})}}

                    placeholder='Seleccione Lugar'
                    size='large'
                    onChange={this.onChange2}



                  />
                  )}
              </Form.Item>
            </Col>
          </Row>

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
              <Form.Item label="Organizador">
                {getFieldDecorator('organizer', {
                  rules: [
                    {
                      required: true,
                      message: 'Quien organiza el evento?',
                    },
                  ],
                })(<Input
                      placeholder='Nombre o institucion '
                      size='large'
                      onChange={e => {this.setState({organizer: e.target.value})}}
                    onPressEnter={console.log("email: "+this.state.email)}
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}
              </Form.Item>
            </Col>
          </Row>

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="creado el dia">
                {getFieldDecorator('date', {
                  rules: [{ required:true, message: 'fecha' }],
                }) (
                  <DatePicker
                    placeholder='Seleccione fecha'
                    size='large'
                    onChange1={this.onChange1}
                    onPressEnter={console.log("birthday: "+this.state.birthday)}
                    format="DD-MM-YYYY"
                    disabledDate2={this.disabledDate2}

                  />
                  )}
              </Form.Item>

            </Col>
          </Row>



          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Creado por">
                {getFieldDecorator('admin', {
                })(<Input
                      placeholder='administrador'
                      size='large'
                      onChange={e => {this.setState({admin: e.target.value})}}
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10 }}
                />)}
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Intereses">
                {getFieldDecorator('interests', {
                  rules: [{ required: false, message: 'marque almenos un interes' }],
                })(
                  <App
                    size='large'
                    onChange={e => {this.setState({interests: e.target.value})}}
                    addonBefore={prefixSelector}
                    placeholder='Ej: 1234567890'
                    style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}
              </Form.Item>
            </Col>
          </Row>









          <Row type="flex" justify="center" align="middle">
            <Col span={2}>
              <Form.Item>
                <Button size='large' type="primary" htmlType="submit" style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                  <Link to='/createEvento'>Crear</Link>
                </Button>
              </Form.Item>
            </Col>






            <Col span={2}>
              <Form.Item>
                <Button size='large' type="primary" htmlType="submit" style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} onClick={this.props.logout} >

                <Link to='/createEvento'>Cancelar</Link>
                </Button>
              </Form.Item>
            </Col>
          </Row>


        </Form>
      );
    }
  }

  const CreateEvento = Form.create({ name: 'register' })(createEvento);



  export default withRouter(CreateEvento);
