import React from 'react';
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
      Modal,

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
  const plainOptions = ['Deporte', 'Cultura', 'Familiar','Ocio','Academia','Social',];
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
 function getBase64(file) {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result);
     reader.onerror = error => reject(error);
   });
 }

 class PicturesWall extends React.Component {
   state = {
     previewVisible: false,
     previewImage: '',
     fileList: [  ],
   };

   handleCancel = () => this.setState({ previewVisible: false });

   handlePreview = async file => {
     if (!file.url && !file.preview) {
       file.preview = await getBase64(file.originFileObj);
     }

     this.setState({
       previewImage: file.url || file.preview,
       previewVisible: true,
     });
   };

   handleChange = ({ fileList }) => this.setState({ fileList });

   render() {
     const { previewVisible, previewImage, fileList } = this.state;
     const uploadButton = (
       <div>
         <Icon type="plus" />
         <div className="ant-upload-text">Upload</div>
       </div>
     );
     return (
       <div className="clearfix">
         <Upload
           action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
           listType="picture-card"
           fileList={fileList}
           onPreview={this.handlePreview}
           onChange={this.handleChange}
         >
           {fileList.length >= 1   ? null : uploadButton}
         </Upload>
         <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
           <img alt="example" style={{ width: '100%' }} src={previewImage} />
         </Modal>
       </div>
     );
   }
 }
/* fin de imagenes */

  function onChange(value) {
    console.log(value);
  }

  class createEvento extends React.Component {
    state = {
      name:'',
      description:'',
      place:'',
      date:'',
      hour:'',
      organizer:'',
      created_at: moment().format('DD-MM-YYYY'),
      admin: localStorage.getItem('user'),
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

    render() {

        console.log(this.state)
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
          <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Crear evento</h1>


          <Row type="flex" justify="center" align="middle">
            <Col span={5}>
              <Form.Item label="Imagen de portada del evento">
                  {getFieldDecorator('multimedia', )
                  (<PicturesWall />

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
                  rules: [{ required: true, message: 'Ingrese el nombre del evento', whitespace: true }],
                })(<Input
                      placeholder='Nombre del evento'
                      size='large'
                      onChange={e => {this.setState({name: e.target.value})}}
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>


          <Row  type="flex" justify="center" align="middle">

            <Col span={7}>
              <Form.Item
                label='Descripción'
              >
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: 'Ingrese descripción del evento', whitespace: true }],
                })(<TextArea rows={4}
                      placeholder='Descripción de evento'
                      size='large'
                      onChange={e => {this.setState({description: e.target.value})} }

                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>


          <br/>
          <Row  type="flex" justify="center" align="middle">
            <Col span={5}>
              <Form.Item label="Fecha del evento">
                {getFieldDecorator('date', {
                  rules: [{ required:true, message: 'Ingresar la fecha del evento' }],
                }) (
                  <DatePicker
                    placeholder='Seleccione fecha'
                    size='large'
                    onChange={(date, dateString) => this.setState({ date: dateString })}
                    format="DD-MM-YYYY"
                    disabledDate={this.disabledDate}

                  />
                  )}
              </Form.Item>

            </Col>


            <Col span={4.5}>
              <Form.Item label="Hora del evento">
                {getFieldDecorator('hour  ', {
                  rules: [{ required:true, message: 'Ingresar la hora del evento' }],
                  setFieldsValue:this.state.hour,
                  initialValue: moment('00:00:00', 'HH:mm:ss')
                })(
                    <TimePicker
                        size='large'
                        placeholder="Hora del evento"
                        onChange={onChange}
                        onChange={(time, timeString) => this.setState({ hour: timeString })} />
                  )}
              </Form.Item>
            </Col>
          </Row>

            <br/>

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Lugar del evento">
                {getFieldDecorator('place', {
                  rules: [{ required:true, message: '¿Dónde se realizará?' }],
                })(
                  <Cascader options={options} onChange={e => {this.setState({place: e.target.value})}}

                    placeholder='Seleccione lugar'
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
                      message: '¿Quién organiza el evento?',
                    },
                  ],
                })(<Input
                      placeholder='Nombre, asociación o institución '
                      size='large'
                      onChange={e => {this.setState({organizer: e.target.value})}}
                      style={{backgroundColor:'#E5E9FF', borderColor:'#E5E9FF',borderRadius:10}}/>)}
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Intereses">
                {getFieldDecorator('interests', {
                  rules: [{ required: false, message: 'Seleccione al menos un interés' }],
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
                  <Link to='/ver-eventos'>Crear</Link>
                </Button>
              </Form.Item>
            </Col>



            <Col span={2}>
              <Form.Item>
                <Button size='large' type="primary" htmlType="submit" style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} onClick={this.props.logout} >

                <Link to='/ver-eventos'>Cancelar</Link>
                </Button>
              </Form.Item>
            </Col>
          </Row>


        </Form>
      );
    }
  }

  const CreateEvent = Form.create({ name: 'register' })(createEvento);



  export default withRouter(CreateEvent);
